import type { APIRoute } from 'astro';
import { validateEnv } from '@/lib/env';
import { containsSQLInjection, containsXSS, isLikelySpam } from '@/lib/security';
import { Resend } from 'resend';
import { getBookingConfirmationEmail } from '@/lib/email-templates';
import { createBooking } from '@/lib/db';
import {
  ALLOWED_ORIGINS,
  sanitizeString,
  isValidEmail,
  isValidPhone,
  checkBookingRateLimit,
  getClientIp,
  getCorsHeaders,
  createOptionsHandler,
  sendTelegramMessage,
} from '@/lib/api-helpers';

export const POST: APIRoute = async ({ request }) => {
  try {
    // Validate environment variables at runtime (first request will trigger this)
    if (import.meta.env.PROD) {
      validateEnv();
    }

    const ip = getClientIp(request);

    // Rate limiting
    if (!checkBookingRateLimit(ip)) {
      return new Response(
        JSON.stringify({ message: 'Zu viele Anfragen. Bitte versuchen Sie es später erneut.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check origin for CSRF protection
    const origin = request.headers.get('origin');

    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
      return new Response(
        JSON.stringify({ message: 'Zugriff verweigert' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check Content-Type
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return new Response(
        JSON.stringify({ message: 'Ungültiges Content-Type' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await request.json();

    // Honeypot check - if honeypot field is filled, it's a bot
    if (data.website || data.url || data.honeypot || data.phone_verify) {
      // Silently accept but don't process (anti-bot)
      return new Response(
        JSON.stringify({ message: 'Terminanfrage erfolgreich gesendet' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Additional security checks
    const allTextFields = [
      data.vorname,
      data.nachname,
      data.email,
      data.leistung,
      data.nachricht,
    ].filter(Boolean).join(' ');

    if (containsSQLInjection(allTextFields)) {
      console.warn('SQL injection attempt detected from IP:', ip);
      return new Response(
        JSON.stringify({ message: 'Ungültige Eingabe erkannt' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (containsXSS(allTextFields)) {
      console.warn('XSS attempt detected from IP:', ip);
      return new Response(
        JSON.stringify({ message: 'Ungültige Eingabe erkannt' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (data.nachricht && isLikelySpam(data.nachricht)) {
      console.warn('Spam detected from IP:', ip);
      return new Response(
        JSON.stringify({ message: 'Verdächtige Nachricht erkannt' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate and sanitize inputs
    const sanitizedData = {
      vorname: sanitizeString(data.vorname || '', { allowApostrophe: true }),
      nachname: sanitizeString(data.nachname || '', { allowApostrophe: true }),
      telefon: sanitizeString(data.telefon || ''),
      email: sanitizeString(data.email || ''),
      leistung: sanitizeString(data.leistung || ''),
      wunschtermin: data.wunschtermin || '',
      wunschuhrzeit: sanitizeString(data.wunschuhrzeit || ''),
      nachricht: sanitizeString(data.nachricht || '', { allowApostrophe: true }),
    };

    // Validate required fields
    if (!sanitizedData.vorname || !sanitizedData.telefon || !sanitizedData.email) {
      return new Response(
        JSON.stringify({ message: 'Pflichtfelder fehlen: Vorname, Telefonnummer und E-Mail-Adresse sind erforderlich' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!isValidEmail(sanitizedData.email)) {
      return new Response(
        JSON.stringify({ message: 'Ungültige E-Mail-Adresse' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (sanitizedData.telefon && !isValidPhone(sanitizedData.telefon)) {
      return new Response(
        JSON.stringify({
          message: 'Ungültige Telefonnummer',
          error: 'Die Telefonnummer muss 6-15 Ziffern enthalten und darf nur Zahlen, +, Leerzeichen, - und () beinhalten.'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate date
    if (sanitizedData.wunschtermin) {
      const selectedDate = new Date(sanitizedData.wunschtermin);
      const minDate = new Date('2026-01-07');
      minDate.setHours(0, 0, 0, 0);

      if (selectedDate < minDate) {
        return new Response(
          JSON.stringify({ message: 'Termine sind ab dem 7. Januar 2026 verfügbar' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const maxDate = new Date('2027-01-07');
      maxDate.setHours(0, 0, 0, 0);

      if (selectedDate > maxDate) {
        return new Response(
          JSON.stringify({ message: 'Wunschtermin darf nicht mehr als 1 Jahr im Voraus liegen (bis 7. Januar 2027)' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    const formatDate = (dateString: string) => {
      if (!dateString) return 'Nicht angegeben';
      try {
        return new Date(dateString).toLocaleDateString('de-DE', {
          day: '2-digit', month: 'long', year: 'numeric',
        });
      } catch { return 'Ungültiges Datum'; }
    };

    const submittedAt = new Date();

    // Send confirmation email to customer
    const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;
    if (RESEND_API_KEY && sanitizedData.email) {
      try {
        const resend = new Resend(RESEND_API_KEY);
        const emailHtml = getBookingConfirmationEmail({
          vorname: sanitizedData.vorname,
          nachname: sanitizedData.nachname,
          email: sanitizedData.email,
          telefon: sanitizedData.telefon,
          leistung: sanitizedData.leistung,
          wunschtermin: sanitizedData.wunschtermin,
          wunschuhrzeit: sanitizedData.wunschuhrzeit,
          nachricht: sanitizedData.nachricht,
        });

        const { error: emailError } = await resend.emails.send({
          from: 'Lena Schneider Fußpflege <info@fusspflege-lena-schneider.de>',
          to: [sanitizedData.email],
          subject: 'Terminanfrage erhalten - Warten auf Bestätigung',
          html: emailHtml,
        });

        if (emailError) {
          console.error('Error sending confirmation email:', emailError);
        }
      } catch (emailError) {
        console.error('Email send error (non-critical):', emailError instanceof Error ? emailError.message : 'Unknown error');
      }
    }

    // Save to database
    let bookingId: number | null = null;
    try {
      const booking = await createBooking({
        vorname: sanitizedData.vorname,
        nachname: sanitizedData.nachname,
        telefon: sanitizedData.telefon,
        email: sanitizedData.email,
        leistung: sanitizedData.leistung,
        wunschtermin: sanitizedData.wunschtermin,
        wunschuhrzeit: sanitizedData.wunschuhrzeit,
        nachricht: sanitizedData.nachricht,
        ip: ip.split(',')[0].trim(),
      });

      bookingId = booking.id;
    } catch (dbError) {
      console.error('Database error:', dbError instanceof Error ? dbError.message : 'Unknown error');
    }

    // Send notification to Telegram
    try {
      const message = `
🆕 <b>Neue Buchungsanfrage${bookingId ? ` #${bookingId}` : ''}</b>

👤 <b>Kunde:</b> ${sanitizedData.vorname} ${sanitizedData.nachname}
📞 <b>Telefon:</b> <code>${sanitizedData.telefon}</code>
📧 <b>Email:</b> ${sanitizedData.email || 'Nicht angegeben'}

💅 <b>Leistung:</b> ${sanitizedData.leistung}
📅 <b>Termin:</b> ${formatDate(sanitizedData.wunschtermin)}
🕐 <b>Uhrzeit:</b> ${sanitizedData.wunschuhrzeit}

📝 <b>Nachricht:</b>
${sanitizedData.nachricht || 'Keine Nachricht'}

⏰ <b>Eingegangen:</b> ${submittedAt.toLocaleString('de-DE')}
`.trim();

      const replyMarkup = bookingId
        ? {
            inline_keyboard: [[
              { text: '✅ Bestätigen', callback_data: `confirm_${bookingId}` },
              { text: '❌ Ablehnen', callback_data: `reject_${bookingId}` },
            ]],
          }
        : undefined;

      await sendTelegramMessage(message, { replyMarkup });
    } catch (telegramError) {
      console.error('Telegram notification failed:', telegramError instanceof Error ? telegramError.message : 'Unknown error');
    }

    return new Response(
      JSON.stringify({ message: 'Terminanfrage erfolgreich gesendet' }),
      { status: 200, headers: getCorsHeaders(request, 'POST') }
    );
  } catch (error) {
    console.error('Booking error:', error instanceof Error ? error.message : 'Unknown error');

    return new Response(
      JSON.stringify({ message: 'Fehler beim Senden der Anfrage. Bitte versuchen Sie es erneut oder rufen Sie uns direkt an.' }),
      { status: 500, headers: getCorsHeaders(request, 'POST') }
    );
  }
};

export const OPTIONS: APIRoute = createOptionsHandler('POST');
