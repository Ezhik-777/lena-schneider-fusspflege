import type { APIRoute } from 'astro';
import { getAvailableSlots } from '@/lib/db';
import { getServiceDuration } from '@/lib/service-config';

// CORS allowed origins
const ALLOWED_ORIGINS = [
  'https://fusspflege-lena-schneider.de',
  'https://www.fusspflege-lena-schneider.de',
  'http://localhost:3000',
  'http://localhost:3001'
];

/**
 * GET /api/available-slots
 * Get available booking slots for a specific date
 *
 * Query params:
 * - date: YYYY-MM-DD (required)
 * - service: Service name (optional, defaults to 1 hour duration)
 *
 * Returns:
 * - List of available time slots for the specified date and service
 */
export const GET: APIRoute = async ({ request, url }) => {
  try {
    // Check origin for CORS protection
    const origin = request.headers.get('origin');

    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
      return new Response(
        JSON.stringify({ message: 'Zugriff verweigert' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get query parameters
    const date = url.searchParams.get('date'); // YYYY-MM-DD
    const service = url.searchParams.get('service'); // Service name

    // Validate required parameters
    if (!date) {
      return new Response(
        JSON.stringify({ message: 'Datum ist erforderlich (date parameter)' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return new Response(
        JSON.stringify({ message: 'Ungültiges Datumsformat. Erwartet: YYYY-MM-DD' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate date is in the future
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return new Response(
        JSON.stringify({ message: 'Datum darf nicht in der Vergangenheit liegen' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Limit to 1 year in the future
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

    if (selectedDate > oneYearFromNow) {
      return new Response(
        JSON.stringify({ message: 'Datum darf nicht mehr als 1 Jahr in der Zukunft liegen' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Determine service duration
    let duration: 1 | 2 = 1; // default to 1 hour
    if (service) {
      duration = getServiceDuration(service);
    }

    // Get available slots from database
    // This checks confirmed bookings and blocked dates
    const availableSlots = await getAvailableSlots(date, duration);

    if (import.meta.env.DEV) {
      console.log(`Available slots for ${date} (${duration}h service): ${availableSlots.length} slots`);
    }

    // Success response with CORS headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (origin && ALLOWED_ORIGINS.includes(origin)) {
      headers['Access-Control-Allow-Origin'] = origin;
      headers['Access-Control-Allow-Methods'] = 'GET';
      headers['Access-Control-Allow-Headers'] = 'Content-Type';
    }

    return new Response(
      JSON.stringify({
        date,
        service: service || 'Standard (1 Stunde)',
        duration: duration === 2 ? '120 Min.' : '60 Min.',
        availableSlots,
        count: availableSlots.length,
      }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error('Available slots error:', error instanceof Error ? error.message : 'Unknown error');

    // Get origin from request for CORS headers
    const origin = request.headers.get('origin');

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (origin && ALLOWED_ORIGINS.includes(origin)) {
      headers['Access-Control-Allow-Origin'] = origin;
      headers['Access-Control-Allow-Methods'] = 'GET';
      headers['Access-Control-Allow-Headers'] = 'Content-Type';
    }

    return new Response(
      JSON.stringify({ message: 'Fehler beim Abrufen der verfügbaren Zeitslots' }),
      { status: 500, headers }
    );
  }
};

// Handle OPTIONS preflight requests
export const OPTIONS: APIRoute = async ({ request }) => {
  const origin = request.headers.get('origin');

  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  return new Response(null, { status: 403 });
};
