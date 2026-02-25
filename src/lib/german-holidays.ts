/**
 * German public holidays (Bundesweite Feiertage)
 * These dates are holidays across all of Germany
 */

export interface Holiday {
  date: string; // YYYY-MM-DD
  name: string;
}

/**
 * Calculate Easter Sunday for a given year (Gauss Easter algorithm)
 */
function getEasterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;

  return new Date(year, month - 1, day);
}

/**
 * Get all German public holidays for a given year
 * Includes Baden-Württemberg regional holidays
 */
export function getGermanHolidays(year: number): Holiday[] {
  const holidays: Holiday[] = [];

  // Fixed holidays
  holidays.push({
    date: `${year}-01-01`,
    name: 'Neujahr',
  });

  holidays.push({
    date: `${year}-05-01`,
    name: 'Tag der Arbeit',
  });

  holidays.push({
    date: `${year}-10-03`,
    name: 'Tag der Deutschen Einheit',
  });

  holidays.push({
    date: `${year}-12-25`,
    name: '1. Weihnachtsfeiertag',
  });

  holidays.push({
    date: `${year}-12-26`,
    name: '2. Weihnachtsfeiertag',
  });

  // Easter-based holidays (movable)
  const easter = getEasterSunday(year);

  // Good Friday (Karfreitag) - 2 days before Easter
  const goodFriday = new Date(easter);
  goodFriday.setDate(easter.getDate() - 2);
  holidays.push({
    date: goodFriday.toISOString().split('T')[0],
    name: 'Karfreitag',
  });

  // Easter Monday (Ostermontag) - 1 day after Easter
  const easterMonday = new Date(easter);
  easterMonday.setDate(easter.getDate() + 1);
  holidays.push({
    date: easterMonday.toISOString().split('T')[0],
    name: 'Ostermontag',
  });

  // Ascension Day (Christi Himmelfahrt) - 39 days after Easter
  const ascension = new Date(easter);
  ascension.setDate(easter.getDate() + 39);
  holidays.push({
    date: ascension.toISOString().split('T')[0],
    name: 'Christi Himmelfahrt',
  });

  // Whit Monday (Pfingstmontag) - 50 days after Easter
  const whitMonday = new Date(easter);
  whitMonday.setDate(easter.getDate() + 50);
  holidays.push({
    date: whitMonday.toISOString().split('T')[0],
    name: 'Pfingstmontag',
  });

  // Baden-Württemberg regional holidays

  // Heilige Drei Könige (Epiphany) - January 6
  holidays.push({
    date: `${year}-01-06`,
    name: 'Heilige Drei Könige',
  });

  // Fronleichnam (Corpus Christi) - 60 days after Easter
  const corpusChristi = new Date(easter);
  corpusChristi.setDate(easter.getDate() + 60);
  holidays.push({
    date: corpusChristi.toISOString().split('T')[0],
    name: 'Fronleichnam',
  });

  // Allerheiligen (All Saints' Day) - November 1
  holidays.push({
    date: `${year}-11-01`,
    name: 'Allerheiligen',
  });

  return holidays;
}

/**
 * Check if a date is a German public holiday
 */
export function isGermanHoliday(date: string): boolean {
  const year = new Date(date).getFullYear();
  const holidays = getGermanHolidays(year);
  return holidays.some(holiday => holiday.date === date);
}

/**
 * Check if a date is a weekend (Saturday or Sunday)
 */
export function isWeekend(date: string): boolean {
  const dayOfWeek = new Date(date).getDay();
  return dayOfWeek === 0 || dayOfWeek === 6; // 0 = Sunday, 6 = Saturday
}

/**
 * Check if a date is a non-working day (weekend or holiday)
 */
export function isNonWorkingDay(date: string): boolean {
  return isWeekend(date) || isGermanHoliday(date);
}

/**
 * Get holiday name for a date (if it's a holiday)
 */
export function getHolidayName(date: string): string | null {
  const year = new Date(date).getFullYear();
  const holidays = getGermanHolidays(year);
  const holiday = holidays.find(h => h.date === date);
  return holiday ? holiday.name : null;
}

/**
 * Get all holidays for a date range
 */
export function getHolidaysInRange(startDate: string, endDate: string): Holiday[] {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const startYear = start.getFullYear();
  const endYear = end.getFullYear();

  const allHolidays: Holiday[] = [];

  // Get holidays for all years in the range
  for (let year = startYear; year <= endYear; year++) {
    allHolidays.push(...getGermanHolidays(year));
  }

  // Filter to date range
  return allHolidays.filter(holiday => {
    return holiday.date >= startDate && holiday.date <= endDate;
  });
}
