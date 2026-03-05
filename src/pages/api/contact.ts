import type { APIRoute } from 'astro';
import { containsSQLInjection, containsXSS, isLikelySpam } from '@/lib/security';
import { Resend } from 'resend';
import { getContactConfirmationEmail, getContactNotificationEmail } from '@/lib/email-templates';
import {
  ALLOWED_ORIGINS,
  sanitizeString,
  isValidEmail,
  isValidPhone,
  checkContactRateLimit,
  getClientIp,
  getCorsHeaders,
  createOptionsHandler,
  sendTelegramMessage,
} from '@/lib/api-helpers';

export const POST: APIRoute = async ({ request }) => {
  try {
    const ip = getClientIp(request);

    if (!checkContactRateLimit(ip)) {
      return new Response(
        JSON.stringify({ message: 'Zu viele Anfragen. Bitte versuchen Sie es später erneut.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const origin = request.headers.get('origin');

    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
      return new Response(
        JSON.stringify({ message: 'Zugriff verweigert' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return new Response(
        JSON.stringify({ message: 'Ungültiges Content-Type' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await request.json();

    // Honeypot check
    if (data.website || data.url || data.honeypot || data.phone_verify) {
      return new Response(
        JSON.stringify({ message: 'Nachricht erfolgreich gesendet' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const allTextFields = [
      data.vorname,
      data.nachname,
      data.email,
      data.nachricht,
      data.telefon,
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

    const sanitizedData = {
      vorname: sanitizeString(data.vorname || '', { allowApostrophe: true }),
      nachname: sanitizeString(data.nachname || '', { allowApostrophe: true }),
      email: sanitizeString(data.email || ''),
      telefon: data.telefon ? sanitizeString(data.telefon) : undefined,
      nachricht: sanitizeString(data.nachricht || '', { allowApostrophe: true, maxLength: 1000 }),
    };

    if (!sanitizedData.vorname || !sanitizedData.nachname || !sanitizedData.email || !sanitizedData.nachricht) {
      return new Response(
        JSON.stringify({ message: 'Pflichtfelder fehlen: Vorname, Nachname, E-Mail und Nachricht sind erforderlich' }),
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

    const submittedAt = new Date();

    // Send emails via Resend
    const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured');
      return new Response(
        JSON.stringify({ message: 'E-Mail-Service nicht konfiguriert' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const resend = new Resend(RESEND_API_KEY);

    try {
      // Send confirmation email to customer
      const { error: confirmationError } = await resend.emails.send({
        from: 'Lena Schneider Fußpflege <info@fusspflege-lena-schneider.de>',
        to: [sanitizedData.email],
        subject: 'Nachricht erhalten - Wir melden uns bald',
        html: getContactConfirmationEmail({
          vorname: sanitizedData.vorname,
          nachname: sanitizedData.nachname,
          email: sanitizedData.email,
          telefon: sanitizedData.telefon,
          nachricht: sanitizedData.nachricht,
        }),
      });

      if (confirmationError) {
        console.error('Error sending confirmation email:', confirmationError);
      }

      // Send notification email to owner
      const { error: notificationError } = await resend.emails.send({
        from: 'Kontaktformular <info@fusspflege-lena-schneider.de>',
        to: ['info@fusspflege-lena-schneider.de'],
        subject: `Neue Kontaktanfrage von ${sanitizedData.vorname} ${sanitizedData.nachname}`,
        html: getContactNotificationEmail({
          vorname: sanitizedData.vorname,
          nachname: sanitizedData.nachname,
          email: sanitizedData.email,
          telefon: sanitizedData.telefon,
          nachricht: sanitizedData.nachricht,
          ip: ip.split(',')[0].trim(),
          submittedAt: submittedAt.toISOString(),
        }),
        replyTo: sanitizedData.email,
      });

      if (notificationError) {
        console.error('Error sending notification email:', notificationError);
      }
    } catch (emailError) {
      console.error('Email send error:', emailError instanceof Error ? emailError.message : 'Unknown error');
      return new Response(
        JSON.stringify({ message: 'Fehler beim Senden der E-Mail. Bitte versuchen Sie es erneut.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Send Telegram notification
    try {
      const message = `
📬 <b>Neue Kontaktanfrage</b>

👤 <b>Name:</b> ${sanitizedData.vorname} ${sanitizedData.nachname}
📧 <b>Email:</b> ${sanitizedData.email}
${sanitizedData.telefon ? `📞 <b>Telefon:</b> <code>${sanitizedData.telefon}</code>\n` : ''}
📝 <b>Nachricht:</b>
${sanitizedData.nachricht}

⏰ <b>Eingegangen:</b> ${submittedAt.toLocaleString('de-DE')}
`.trim();

      await sendTelegramMessage(message);
    } catch (telegramError) {
      console.error('Telegram notification failed:', telegramError instanceof Error ? telegramError.message : 'Unknown error');
    }

    return new Response(
      JSON.stringify({ message: 'Nachricht erfolgreich gesendet' }),
      { status: 200, headers: getCorsHeaders(request, 'POST') }
    );
  } catch (error) {
    console.error('Contact form error:', error instanceof Error ? error.message : 'Unknown error');

    return new Response(
      JSON.stringify({ message: 'Fehler beim Senden der Nachricht. Bitte versuchen Sie es erneut oder rufen Sie uns direkt an.' }),
      { status: 500, headers: getCorsHeaders(request, 'POST') }
    );
  }
};

export const OPTIONS: APIRoute = createOptionsHandler('POST');
