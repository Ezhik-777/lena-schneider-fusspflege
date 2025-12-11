import { NextRequest, NextResponse } from 'next/server';
import { validateEnv } from '@/lib/env';
import { containsSQLInjection, containsXSS, isLikelySpam } from '@/lib/security';
import { Resend } from 'resend';
import { getBookingConfirmationEmail } from '@/lib/email-templates';
import { createBooking } from '@/lib/db';

// Rate limiting: Simple in-memory store (for production, use Redis or similar)
const submissionTracker = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_SUBMISSIONS_PER_HOUR = 5; // Production: reasonable limit for booking requests

// Helper function to sanitize string inputs (XSS prevention)
// allowApostrophe: allow single quotes for names like O'Connor, D'Angelo
function sanitizeString(input: string, allowApostrophe: boolean = false): string {
  const dangerousCharsRegex = allowApostrophe
    ? /[<>"`]/g  // Allow single quotes and SPACES for names
    : /[<>"'`]/g; // Remove dangerous chars but KEEP SPACES

  return input
    .trim()
    .slice(0, 500) // Limit length to prevent abuse
    .replace(dangerousCharsRegex, '')
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .replace(/<script/gi, ''); // Remove script tags
}

// Validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email) && email.length <= 254;
}

// Validate phone number (flexible international format)
function isValidPhone(phone: string): boolean {
  // Remove all formatting characters (spaces, dashes, parentheses, slashes)
  const cleanPhone = phone.replace(/[\s\-\/()]/g, '');

  // Check if it contains only numbers and optionally starts with +
  if (!/^\+?[0-9]+$/.test(cleanPhone)) {
    return false;
  }

  // Get just the digits (without +)
  const digits = cleanPhone.replace(/^\+/, '');

  // Check minimum and maximum length
  return digits.length >= 6 && digits.length <= 15;
}

// Rate limiting check
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userSubmissions = submissionTracker.get(ip);

  // Clean up old entries (older than rate limit window)
  if (userSubmissions && now - userSubmissions.timestamp > RATE_LIMIT_WINDOW) {
    submissionTracker.delete(ip);
    return true;
  }

  if (!userSubmissions) {
    submissionTracker.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (userSubmissions.count >= MAX_SUBMISSIONS_PER_HOUR) {
    return false;
  }

  userSubmissions.count++;
  return true;
}

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  'https://fusspflege-lena-schneider.de',
  'https://www.fusspflege-lena-schneider.de',
  'http://localhost:3000',
  'http://localhost:3001'
];

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables at runtime (first request will trigger this)
    if (process.env.NODE_ENV === 'production') {
      validateEnv();
    }

    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

    // Rate limiting
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { message: 'Zu viele Anfragen. Bitte versuchen Sie es später erneut.' },
        { status: 429 }
      );
    }

    // Check origin for CSRF protection
    const origin = request.headers.get('origin');

    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
      return NextResponse.json(
        { message: 'Zugriff verweigert' },
        { status: 403 }
      );
    }

    // Check Content-Type
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json(
        { message: 'Ungültiges Content-Type' },
        { status: 400 }
      );
    }

    const data = await request.json();

    // Honeypot check - if honeypot field is filled, it's a bot
    if (data.website || data.url || data.honeypot || data.phone_verify) {
      // Silently accept but don't process (anti-bot)
      return NextResponse.json(
        { message: 'Terminanfrage erfolgreich gesendet' },
        { status: 200 }
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

    // Check for SQL injection attempts
    if (containsSQLInjection(allTextFields)) {
      console.warn('SQL injection attempt detected from IP:', ip);
      return NextResponse.json(
        { message: 'Ungültige Eingabe erkannt' },
        { status: 400 }
      );
    }

    // Check for XSS attempts
    if (containsXSS(allTextFields)) {
      console.warn('XSS attempt detected from IP:', ip);
      return NextResponse.json(
        { message: 'Ungültige Eingabe erkannt' },
        { status: 400 }
      );
    }

    // Check for spam in message field
    if (data.nachricht && isLikelySpam(data.nachricht)) {
      console.warn('Spam detected from IP:', ip);
      return NextResponse.json(
        { message: 'Verdächtige Nachricht erkannt' },
        { status: 400 }
      );
    }

    // Validate and sanitize inputs
    const sanitizedData = {
      vorname: sanitizeString(data.vorname || '', true), // Allow apostrophes in names
      nachname: sanitizeString(data.nachname || '', true), // Allow apostrophes in names
      telefon: sanitizeString(data.telefon || ''),
      email: sanitizeString(data.email || ''),
      leistung: sanitizeString(data.leistung || ''),
      wunschtermin: data.wunschtermin || '',
      wunschuhrzeit: sanitizeString(data.wunschuhrzeit || ''),
      nachricht: sanitizeString(data.nachricht || '', true), // Allow apostrophes in messages
    };

    // Validate required fields (Vorname, Telefon, and Email are required)
    if (!sanitizedData.vorname || !sanitizedData.telefon || !sanitizedData.email) {
      return NextResponse.json(
        { message: 'Pflichtfelder fehlen: Vorname, Telefonnummer und E-Mail-Adresse sind erforderlich' },
        { status: 400 }
      );
    }

    // Validate email format (now required)
    if (!isValidEmail(sanitizedData.email)) {
      return NextResponse.json(
        { message: 'Ungültige E-Mail-Adresse' },
        { status: 400 }
      );
    }

    // Validate phone if provided
    if (sanitizedData.telefon && !isValidPhone(sanitizedData.telefon)) {
      return NextResponse.json(
        {
          message: 'Ungültige Telefonnummer',
          error: 'Die Telefonnummer muss 6-15 Ziffern enthalten und darf nur Zahlen, +, Leerzeichen, - und () beinhalten.'
        },
        { status: 400 }
      );
    }

    // Validate date is not before January 7, 2026
    if (sanitizedData.wunschtermin) {
      const selectedDate = new Date(sanitizedData.wunschtermin);
      const minDate = new Date('2026-01-07');
      minDate.setHours(0, 0, 0, 0);

      if (selectedDate < minDate) {
        return NextResponse.json(
          { message: 'Termine sind ab dem 7. Januar 2026 verfügbar' },
          { status: 400 }
        );
      }

      // Limit to 1 year from January 7, 2026
      const maxDate = new Date('2027-01-07');
      maxDate.setHours(0, 0, 0, 0);

      if (selectedDate > maxDate) {
        return NextResponse.json(
          { message: 'Wunschtermin darf nicht mehr als 1 Jahr im Voraus liegen (bis 7. Januar 2027)' },
          { status: 400 }
        );
      }
    }

    // Telegram bot configuration
    const TELEGRAM_DISABLED = false; // Enabled for testing
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (TELEGRAM_DISABLED) {
      console.log('Telegram notifications disabled for testing');
    } else if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.warn('Telegram credentials not found - notifications will not be sent');
    }

    // Format date helper
    const formatDate = (dateString: string) => {
      if (!dateString) return 'Nicht angegeben';
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('de-DE', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        });
      } catch {
        return 'Ungültiges Datum';
      }
    };

    const submittedAt = new Date();

    // Send confirmation email to customer
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
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

        const { data: emailData, error: emailError } = await resend.emails.send({
          from: 'Lena Schneider Fußpflege <info@fusspflege-lena-schneider.de>',
          to: [sanitizedData.email],
          subject: 'Terminanfrage erhalten - Warten auf Bestätigung',
          html: emailHtml,
        });

        if (emailError) {
          console.error('Error sending confirmation email:', emailError);
        } else {
          console.log('Confirmation email sent successfully. ID:', emailData?.id);
        }
      } catch (emailError) {
        // Log email error but don't fail the request
        console.error('Email send error (non-critical):', emailError instanceof Error ? emailError.message : 'Unknown error');
      }
    } else {
      if (process.env.NODE_ENV === 'development') {
        if (!RESEND_API_KEY) {
          console.log('Resend API key not configured, skipping email');
        } else if (!sanitizedData.email) {
          console.log('No email provided by customer, skipping confirmation email');
        }
      }
    }

    // Save to Vercel Postgres database
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
      console.log('✅ Booking saved to database with ID:', booking.id);
    } catch (dbError) {
      console.error('Database error:', dbError instanceof Error ? dbError.message : 'Unknown error');
      // Don't fail the request if DB save fails - customer already got email
    }

    // Send notification to Telegram bot (even if DB failed)
    if (!TELEGRAM_DISABLED && TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
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

        const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        const requestBody: any = {
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'HTML',
        };

        // Only add buttons if we have bookingId
        if (bookingId) {
          requestBody.reply_markup = {
            inline_keyboard: [
              [
                { text: '✅ Bestätigen', callback_data: `confirm_${bookingId}` },
                { text: '❌ Ablehnen', callback_data: `reject_${bookingId}` },
              ],
            ],
          };
        }

        const telegramResponse = await fetch(telegramUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        if (!telegramResponse.ok) {
          const errorData = await telegramResponse.json();
          console.error('Telegram notification error:', errorData);
        } else {
          console.log('✅ Telegram notification sent' + (bookingId ? ' with inline buttons' : ''));
        }
      } catch (telegramError) {
        console.error('Telegram notification failed:', telegramError instanceof Error ? telegramError.message : 'Unknown error');
      }
    }

    // Success response with CORS headers
    const successResponse = NextResponse.json(
      { message: 'Terminanfrage erfolgreich gesendet' },
      { status: 200 }
    );

    if (origin && ALLOWED_ORIGINS.includes(origin)) {
      successResponse.headers.set('Access-Control-Allow-Origin', origin);
      successResponse.headers.set('Access-Control-Allow-Methods', 'POST');
      successResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    }

    return successResponse;
  } catch (error) {
    // Generic error message - don't expose internal details
    console.error('Booking error:', error instanceof Error ? error.message : 'Unknown error');

    // Get origin from request for CORS headers
    const origin = request.headers.get('origin');

    const errorResponse = NextResponse.json(
      { message: 'Fehler beim Senden der Anfrage. Bitte versuchen Sie es erneut oder rufen Sie uns direkt an.' },
      { status: 500 }
    );

    if (origin && ALLOWED_ORIGINS.includes(origin)) {
      errorResponse.headers.set('Access-Control-Allow-Origin', origin);
      errorResponse.headers.set('Access-Control-Allow-Methods', 'POST');
      errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    }

    return errorResponse;
  }
}

// Handle OPTIONS preflight requests
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');

  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  return new NextResponse(null, { status: 403 });
}
