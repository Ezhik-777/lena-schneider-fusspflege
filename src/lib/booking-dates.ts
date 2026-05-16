export function toStartOfDay(date: Date): Date {
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);
  return normalizedDate;
}

// First date for which bookings are no longer accepted.
// Anything on/after this date is blocked in the calendar, on the API and in the UI.
export const BOOKING_CUTOFF_DATE = new Date(2026, 5, 1); // 2026-06-01

export function getBookingDateRange(now = new Date()): {
  minDate: Date;
  maxDate: Date;
  bookingsClosed: boolean;
} {
  const minDate = toStartOfDay(now);
  const yearAhead = new Date(minDate);
  yearAhead.setFullYear(yearAhead.getFullYear() + 1);

  const lastBookableDay = toStartOfDay(new Date(BOOKING_CUTOFF_DATE));
  lastBookableDay.setDate(lastBookableDay.getDate() - 1);

  const maxDate = yearAhead < lastBookableDay ? yearAhead : lastBookableDay;
  const bookingsClosed = maxDate < minDate;

  return { minDate, maxDate, bookingsClosed };
}

export function formatDateForInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function formatDateForDisplay(date: Date, locale = 'de-DE'): string {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}
