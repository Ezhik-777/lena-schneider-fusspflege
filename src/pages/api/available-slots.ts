import type { APIRoute } from 'astro';
import { getBookingDateRange } from '@/lib/booking-dates';
import { getAvailableSlots } from '@/lib/db';
import { getServiceDuration } from '@/lib/service-config';
import { ALLOWED_ORIGINS, getCorsHeaders, createOptionsHandler } from '@/lib/api-helpers';

export const GET: APIRoute = async ({ request, url }) => {
  try {
    const origin = request.headers.get('origin');

    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
      return new Response(
        JSON.stringify({ message: 'Zugriff verweigert' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const date = url.searchParams.get('date');
    const service = url.searchParams.get('service');

    if (!date) {
      return new Response(
        JSON.stringify({ message: 'Datum ist erforderlich (date parameter)' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return new Response(
        JSON.stringify({ message: 'Ungültiges Datumsformat. Erwartet: YYYY-MM-DD' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const selectedDate = new Date(date);
    const { minDate, maxDate } = getBookingDateRange();

    if (selectedDate < minDate) {
      return new Response(
        JSON.stringify({ message: 'Datum darf nicht in der Vergangenheit liegen' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (selectedDate > maxDate) {
      return new Response(
        JSON.stringify({ message: 'Datum darf nicht mehr als 1 Jahr in der Zukunft liegen' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let duration: 1 | 2 = 1;
    if (service) {
      duration = getServiceDuration(service);
    }

    const availableSlots = await getAvailableSlots(date, duration);

    return new Response(
      JSON.stringify({
        date,
        service: service || 'Standard (1 Stunde)',
        duration: duration === 2 ? '120 Min.' : '60 Min.',
        availableSlots,
        count: availableSlots.length,
      }),
      { status: 200, headers: getCorsHeaders(request, 'GET') }
    );
  } catch (error) {
    console.error('Available slots error:', error instanceof Error ? error.message : 'Unknown error');

    return new Response(
      JSON.stringify({ message: 'Fehler beim Abrufen der verfügbaren Zeitslots' }),
      { status: 500, headers: getCorsHeaders(request, 'GET') }
    );
  }
};

export const OPTIONS: APIRoute = createOptionsHandler('GET');
