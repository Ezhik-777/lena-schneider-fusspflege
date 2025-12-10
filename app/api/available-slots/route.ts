import { NextRequest, NextResponse } from 'next/server';
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
export async function GET(request: NextRequest) {
  try {
    // Check origin for CORS protection
    const origin = request.headers.get('origin');

    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
      return NextResponse.json(
        { message: 'Zugriff verweigert' },
        { status: 403 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date'); // YYYY-MM-DD
    const service = searchParams.get('service'); // Service name

    // Validate required parameters
    if (!date) {
      return NextResponse.json(
        { message: 'Datum ist erforderlich (date parameter)' },
        { status: 400 }
      );
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return NextResponse.json(
        { message: 'Ungültiges Datumsformat. Erwartet: YYYY-MM-DD' },
        { status: 400 }
      );
    }

    // Validate date is in the future
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return NextResponse.json(
        { message: 'Datum darf nicht in der Vergangenheit liegen' },
        { status: 400 }
      );
    }

    // Limit to 1 year in the future
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

    if (selectedDate > oneYearFromNow) {
      return NextResponse.json(
        { message: 'Datum darf nicht mehr als 1 Jahr in der Zukunft liegen' },
        { status: 400 }
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

    if (process.env.NODE_ENV === 'development') {
      console.log(`Available slots for ${date} (${duration}h service): ${availableSlots.length} slots`);
    }

    // Success response with CORS headers
    const successResponse = NextResponse.json(
      {
        date,
        service: service || 'Standard (1 Stunde)',
        duration: duration === 2 ? '120 Min.' : '60 Min.',
        availableSlots,
        count: availableSlots.length,
      },
      { status: 200 }
    );

    if (origin && ALLOWED_ORIGINS.includes(origin)) {
      successResponse.headers.set('Access-Control-Allow-Origin', origin);
      successResponse.headers.set('Access-Control-Allow-Methods', 'GET');
      successResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    }

    return successResponse;
  } catch (error) {
    console.error('Available slots error:', error instanceof Error ? error.message : 'Unknown error');

    // Get origin from request for CORS headers
    const origin = request.headers.get('origin');

    const errorResponse = NextResponse.json(
      { message: 'Fehler beim Abrufen der verfügbaren Zeitslots' },
      { status: 500 }
    );

    if (origin && ALLOWED_ORIGINS.includes(origin)) {
      errorResponse.headers.set('Access-Control-Allow-Origin', origin);
      errorResponse.headers.set('Access-Control-Allow-Methods', 'GET');
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
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  return new NextResponse(null, { status: 403 });
}
