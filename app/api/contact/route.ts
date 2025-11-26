import { NextRequest, NextResponse } from 'next/server';
import { containsSQLInjection, containsXSS, isLikelySpam } from '@/lib/security';
import { Resend } from 'resend';
import { getContactConfirmationEmail, getContactNotificationEmail } from '@/lib/email-templates';

// Rate limiting: Simple in-memory store
const submissionTracker = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_SUBMISSIONS_PER_HOUR = 10;

// Helper function to sanitize string inputs
function sanitizeString(input: string, allowApostrophe: boolean = false): string {
  const dangerousCharsRegex = allowApostrophe
    ? /[<>"`]/g  // Allow single quotes and spaces for names
    : /[<>"'`]/g; // Remove all quote types but keep spaces

  return input
    .trim()
    .slice(0, 1000) // Limit length
    .replace(dangerousCharsRegex, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .replace(/<script/gi, '');
}

// Validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email) && email.length <= 254;
}

// Validate phone number (flexible international format)
function isValidPhone(phone: string): boolean {
  const cleanPhone = phone.replace(/[\s\-\/()]/g, '');
  if (!/^\+?[0-9]+$/.test(cleanPhone)) return false;
  const digits = cleanPhone.replace(/^\+/, '');
  return digits.length >= 6 && digits.length <= 15;
}

// Rate limiting check
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userSubmissions = submissionTracker.get(ip);

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

    // Honeypot check
    if (data.website || data.url || data.honeypot || data.phone_verify) {
      return NextResponse.json(
        { message: 'Nachricht erfolgreich gesendet' },
        { status: 200 }
      );
    }

    // Additional security checks
    const allTextFields = [
      data.vorname,
      data.nachname,
      data.email,
      data.nachricht,
      data.telefon,
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
      vorname: sanitizeString(data.vorname || '', true),
      nachname: sanitizeString(data.nachname || '', true),
      email: sanitizeString(data.email || ''),
      telefon: data.telefon ? sanitizeString(data.telefon) : undefined,
      nachricht: sanitizeString(data.nachricht || '', true),
    };

    // Validate required fields
    if (!sanitizedData.vorname || !sanitizedData.nachname || !sanitizedData.email || !sanitizedData.nachricht) {
      return NextResponse.json(
        { message: 'Pflichtfelder fehlen: Vorname, Nachname, E-Mail und Nachricht sind erforderlich' },
        { status: 400 }
      );
    }

    // Validate email
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

    const submittedAt = new Date();

    // Send emails via Resend
    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured');
      return NextResponse.json(
        { message: 'E-Mail-Service nicht konfiguriert' },
        { status: 500 }
      );
    }

    const resend = new Resend(RESEND_API_KEY);

    try {
      // Send confirmation email to customer
      const confirmationEmailHtml = getContactConfirmationEmail({
        vorname: sanitizedData.vorname,
        nachname: sanitizedData.nachname,
        email: sanitizedData.email,
        telefon: sanitizedData.telefon,
        nachricht: sanitizedData.nachricht,
      });

      const { data: confirmationData, error: confirmationError } = await resend.emails.send({
        from: 'Lena Schneider Fußpflege <info@fusspflege-lena-schneider.de>',
        to: [sanitizedData.email],
        subject: 'Nachricht erhalten - Wir melden uns bald',
        html: confirmationEmailHtml,
      });

      if (confirmationError) {
        console.error('Error sending confirmation email:', confirmationError);
      } else {
        console.log('Confirmation email sent successfully. ID:', confirmationData?.id);
      }

      // Send notification email to owner
      const notificationEmailHtml = getContactNotificationEmail({
        vorname: sanitizedData.vorname,
        nachname: sanitizedData.nachname,
        email: sanitizedData.email,
        telefon: sanitizedData.telefon,
        nachricht: sanitizedData.nachricht,
        ip: ip.split(',')[0].trim(),
        submittedAt: submittedAt.toISOString(),
      });

      const { data: notificationData, error: notificationError } = await resend.emails.send({
        from: 'Kontaktformular <info@fusspflege-lena-schneider.de>',
        to: ['info@fusspflege-lena-schneider.de'], // Owner email
        subject: `🆕 Neue Kontaktanfrage von ${sanitizedData.vorname} ${sanitizedData.nachname}`,
        html: notificationEmailHtml,
        replyTo: sanitizedData.email, // Allow direct reply to customer
      });

      if (notificationError) {
        console.error('Error sending notification email:', notificationError);
        // Don't fail the request if notification fails
      } else {
        console.log('Notification email sent successfully. ID:', notificationData?.id);
      }

    } catch (emailError) {
      console.error('Email send error:', emailError instanceof Error ? emailError.message : 'Unknown error');
      return NextResponse.json(
        { message: 'Fehler beim Senden der E-Mail. Bitte versuchen Sie es erneut.' },
        { status: 500 }
      );
    }

    // Success response with CORS headers
    const successResponse = NextResponse.json(
      { message: 'Nachricht erfolgreich gesendet' },
      { status: 200 }
    );

    if (origin && ALLOWED_ORIGINS.includes(origin)) {
      successResponse.headers.set('Access-Control-Allow-Origin', origin);
      successResponse.headers.set('Access-Control-Allow-Methods', 'POST');
      successResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    }

    return successResponse;
  } catch (error) {
    console.error('Contact form error:', error instanceof Error ? error.message : 'Unknown error');

    const origin = request.headers.get('origin');

    const errorResponse = NextResponse.json(
      { message: 'Fehler beim Senden der Nachricht. Bitte versuchen Sie es erneut oder rufen Sie uns direkt an.' },
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
