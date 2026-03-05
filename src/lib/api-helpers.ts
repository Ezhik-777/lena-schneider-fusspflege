import { checkRateLimit as securityCheckRateLimit } from './security';

// ── Allowed origins ──────────────────────────────────────────────────────────
export const ALLOWED_ORIGINS = [
  'https://fusspflege-lena-schneider.de',
  'https://www.fusspflege-lena-schneider.de',
  'http://localhost:3000',
  'http://localhost:3001',
];

// ── Sanitization ─────────────────────────────────────────────────────────────
export function sanitizeString(
  input: string,
  opts: { allowApostrophe?: boolean; maxLength?: number } = {},
): string {
  const { allowApostrophe = false, maxLength = 500 } = opts;

  const dangerousCharsRegex = allowApostrophe ? /[<>"`]/g : /[<>"'`]/g;

  return input
    .trim()
    .slice(0, maxLength)
    .replace(dangerousCharsRegex, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .replace(/<script/gi, '');
}

// ── Validation ───────────────────────────────────────────────────────────────
export function isValidEmail(email: string): boolean {
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email) && email.length <= 254;
}

export function isValidPhone(phone: string): boolean {
  const cleanPhone = phone.replace(/[\s\-\/()]/g, '');
  if (!/^\+?[0-9]+$/.test(cleanPhone)) return false;
  const digits = cleanPhone.replace(/^\+/, '');
  return digits.length >= 6 && digits.length <= 15;
}

// ── Rate limiting ────────────────────────────────────────────────────────────
const bookingRateLimitStore = new Map<string, { count: number; resetAt: number }>();
const contactRateLimitStore = new Map<string, { count: number; resetAt: number }>();

const HOUR = 60 * 60 * 1000;

export function checkBookingRateLimit(ip: string): boolean {
  return securityCheckRateLimit(ip, 5, HOUR, bookingRateLimitStore).allowed;
}

export function checkContactRateLimit(ip: string): boolean {
  return securityCheckRateLimit(ip, 10, HOUR, contactRateLimitStore).allowed;
}

// ── Request helpers ──────────────────────────────────────────────────────────
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
}

export function getCorsHeaders(request: Request, methods: string): Record<string, string> {
  const origin = request.headers.get('origin');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Methods'] = methods;
    headers['Access-Control-Allow-Headers'] = 'Content-Type';
  }

  return headers;
}

export function createOptionsHandler(methods: string) {
  return async ({ request }: { request: Request }) => {
    const origin = request.headers.get('origin');

    if (origin && ALLOWED_ORIGINS.includes(origin)) {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Methods': `${methods}, OPTIONS`,
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    return new Response(null, { status: 403 });
  };
}

// ── Telegram helper ──────────────────────────────────────────────────────────
export async function sendTelegramMessage(
  text: string,
  opts?: { replyMarkup?: object },
): Promise<void> {
  const BOT_TOKEN = import.meta.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = import.meta.env.TELEGRAM_CHAT_ID;

  if (!BOT_TOKEN || !CHAT_ID) {
    console.warn('Telegram credentials not configured, skipping notification');
    return;
  }

  const body: Record<string, unknown> = {
    chat_id: CHAT_ID,
    text,
    parse_mode: 'HTML',
  };
  if (opts?.replyMarkup) body.reply_markup = opts.replyMarkup;

  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json();
    console.error('Telegram notification error:', err);
  }
}
