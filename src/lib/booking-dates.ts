export function toStartOfDay(date: Date): Date {
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);
  return normalizedDate;
}

export function getBookingDateRange(now = new Date()): {
  minDate: Date;
  maxDate: Date;
} {
  const minDate = toStartOfDay(now);
  const maxDate = new Date(minDate);
  maxDate.setFullYear(maxDate.getFullYear() + 1);
  return { minDate, maxDate };
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
