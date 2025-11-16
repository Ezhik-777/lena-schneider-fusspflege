import { NextRequest, NextResponse } from 'next/server';
import { validateEnv } from '@/lib/env';

// Rate limiting: Simple in-memory store (for production, use Redis or similar)
// Updated: 2025-11-09 - Increased limit for testing
const submissionTracker = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_SUBMISSIONS_PER_HOUR = 20; // Temporarily increased for testing

// Helper function to sanitize string inputs (XSS prevention)
// allowApostrophe: allow single quotes for names like O'Connor, D'Angelo
function sanitizeString(input: string, allowApostrophe: boolean = false): string {
  const dangerousCharsRegex = allowApostrophe
    ? /[<>\"` ]/g  // Allow single quotes for names
    : /[<>\"'`]/g; // Remove all quote types

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

    // Validate required fields (only Vorname and Telefon are required)
    if (!sanitizedData.vorname || !sanitizedData.telefon) {
      return NextResponse.json(
        { message: 'Pflichtfelder fehlen: Vorname und Telefonnummer sind erforderlich' },
        { status: 400 }
      );
    }

    // Validate email if provided
    if (sanitizedData.email && !isValidEmail(sanitizedData.email)) {
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

    // Validate date is in the future
    if (sanitizedData.wunschtermin) {
      const selectedDate = new Date(sanitizedData.wunschtermin);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        return NextResponse.json(
          { message: 'Wunschtermin darf nicht in der Vergangenheit liegen' },
          { status: 400 }
        );
      }

      // Limit to 1 year in the future
      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

      if (selectedDate > oneYearFromNow) {
        return NextResponse.json(
          { message: 'Wunschtermin darf nicht mehr als 1 Jahr in der Zukunft liegen' },
          { status: 400 }
        );
      }
    }

    // Get Telegram credentials from environment
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    // DEBUG: Log token format (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log('Token length:', TELEGRAM_BOT_TOKEN?.length);
      console.log('Chat ID:', TELEGRAM_CHAT_ID);
      console.log('Token starts with:', TELEGRAM_BOT_TOKEN?.substring(0, 15));
    }

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error('Telegram credentials are not configured');
      // Don't log user data for privacy
      return NextResponse.json(
        { message: 'Anfrage empfangen (Benachrichtigungen noch nicht konfiguriert)' },
        { status: 200 }
      );
    }

    // Format date
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

    // Create formatted message for Telegram (sanitized data is already safe)
    const submittedAt = new Date();
    const message = `
🆕 <b>NEUE BUCHUNGSANFRAGE</b>

👤 <b>Kunde:</b>
   ${sanitizedData.vorname} ${sanitizedData.nachname}

📞 <b>Telefon:</b>
   <code>${sanitizedData.telefon || 'Nicht angegeben'}</code>

📧 <b>Email:</b>
   ${sanitizedData.email}

💅 <b>Gewünschte Leistung:</b>
   ${sanitizedData.leistung || 'Nicht angegeben'}

📅 <b>Wunschtermin:</b>
   ${formatDate(sanitizedData.wunschtermin)}

🕐 <b>Wunschuhrzeit:</b>
   ${sanitizedData.wunschuhrzeit || 'Nicht angegeben'}

📝 <b>Nachricht:</b>
   ${sanitizedData.nachricht || 'Keine Nachricht'}

⏰ <b>Eingegangen am:</b>
   ${submittedAt.toLocaleString('de-DE')}

🌐 <b>IP:</b> ${ip.split(',')[0].trim()}

━━━━━━━━━━━━━━━━━━━━━━
🌐 Quelle: Website
`.trim();

    // Send to Telegram with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    try {
      const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
      const telegramResponse = await fetch(telegramUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'HTML',
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!telegramResponse.ok) {
        const errorData = await telegramResponse.json();
        console.error('Telegram API error:', JSON.stringify(errorData, null, 2));
        console.error('Telegram response status:', telegramResponse.status);
        throw new Error(`Failed to send notification to Telegram: ${JSON.stringify(errorData)}`);
      }

      const successData = await telegramResponse.json();
      if (process.env.NODE_ENV === 'development') {
        console.log('Telegram message sent successfully:', successData.result?.message_id);
      }
    } catch (error) {
      clearTimeout(timeoutId);
      // Log error but don't expose details to user
      console.error('Telegram send error:', error instanceof Error ? error.message : 'Unknown error');
      throw error;
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
