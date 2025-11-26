import { sql } from '@vercel/postgres';

export interface Booking {
  id: number;
  vorname: string;
  nachname: string;
  telefon: string;
  email?: string;
  leistung: string;
  wunschtermin: string; // YYYY-MM-DD
  wunschuhrzeit: string;
  nachricht?: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'cancelled';
  ip?: string;
  created_at: Date;
  updated_at: Date;
  confirmed_at?: Date;
  rejected_at?: Date;
}

export interface BlockedDate {
  id: number;
  date: string; // YYYY-MM-DD
  reason?: string;
  created_at: Date;
}

// Save new booking
export async function createBooking(data: {
  vorname: string;
  nachname: string;
  telefon: string;
  email?: string;
  leistung: string;
  wunschtermin: string;
  wunschuhrzeit: string;
  nachricht?: string;
  ip?: string;
}): Promise<Booking> {
  const result = await sql`
    INSERT INTO bookings (
      vorname, nachname, telefon, email, leistung,
      wunschtermin, wunschuhrzeit, nachricht, ip, status
    )
    VALUES (
      ${data.vorname}, ${data.nachname}, ${data.telefon}, ${data.email || null},
      ${data.leistung}, ${data.wunschtermin}, ${data.wunschuhrzeit},
      ${data.nachricht || null}, ${data.ip || null}, 'pending'
    )
    RETURNING *
  `;

  return result.rows[0] as Booking;
}

// Get booking by ID
export async function getBookingById(id: number): Promise<Booking | null> {
  const result = await sql`
    SELECT * FROM bookings WHERE id = ${id}
  `;

  return result.rows[0] as Booking || null;
}

// Update booking status
export async function updateBookingStatus(
  id: number,
  status: 'confirmed' | 'rejected' | 'cancelled'
): Promise<Booking> {
  let result;

  if (status === 'confirmed') {
    result = await sql`
      UPDATE bookings
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP, confirmed_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;
  } else if (status === 'rejected') {
    result = await sql`
      UPDATE bookings
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP, rejected_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;
  } else {
    result = await sql`
      UPDATE bookings
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;
  }

  return result.rows[0] as Booking;
}

// Get all confirmed bookings for a specific date
export async function getConfirmedBookingsByDate(date: string): Promise<Booking[]> {
  const result = await sql`
    SELECT * FROM bookings
    WHERE wunschtermin = ${date}
    AND status = 'confirmed'
    ORDER BY wunschuhrzeit
  `;

  return result.rows as Booking[];
}

// Get all pending bookings
export async function getPendingBookings(): Promise<Booking[]> {
  const result = await sql`
    SELECT * FROM bookings
    WHERE status = 'pending'
    ORDER BY created_at DESC
  `;

  return result.rows as Booking[];
}

// Block a date
export async function blockDate(date: string, reason?: string): Promise<BlockedDate> {
  const result = await sql`
    INSERT INTO blocked_dates (date, reason)
    VALUES (${date}, ${reason || null})
    ON CONFLICT (date) DO UPDATE SET reason = ${reason || null}
    RETURNING *
  `;

  return result.rows[0] as BlockedDate;
}

// Unblock a date
export async function unblockDate(date: string): Promise<void> {
  await sql`
    DELETE FROM blocked_dates WHERE date = ${date}
  `;
}

// Get all blocked dates
export async function getBlockedDates(): Promise<BlockedDate[]> {
  const result = await sql`
    SELECT * FROM blocked_dates
    ORDER BY date
  `;

  return result.rows as BlockedDate[];
}

// Check if a date is blocked
export async function isDateBlocked(date: string): Promise<boolean> {
  const result = await sql`
    SELECT COUNT(*) as count FROM blocked_dates WHERE date = ${date}
  `;

  return parseInt(result.rows[0].count) > 0;
}

// Get available time slots for a date
// duration: 1 (hour) or 2 (hours) - default 1
export async function getAvailableSlots(date: string, duration: 1 | 2 = 1): Promise<string[]> {
  // All time slots from 9:00 to 16:00
  let allSlots: string[];

  if (duration === 2) {
    // For manicure (2 hours): 9-11, 11-13, 13-15
    allSlots = [
      '09:00 - 11:00',
      '11:00 - 13:00',
      '13:00 - 15:00',
      '14:00 - 16:00', // Добавочный слот
    ];
  } else {
    // For other services (1 hour): 9-10, 10-11, ..., 15-16
    allSlots = [
      '09:00 - 10:00',
      '10:00 - 11:00',
      '11:00 - 12:00',
      '12:00 - 13:00',
      '13:00 - 14:00',
      '14:00 - 15:00',
      '15:00 - 16:00',
    ];
  }

  // Check if date is blocked
  const blocked = await isDateBlocked(date);
  if (blocked) {
    return [];
  }

  // Get confirmed bookings for this date
  const confirmedBookings = await getConfirmedBookingsByDate(date);
  const bookedSlots = confirmedBookings.map(b => b.wunschuhrzeit);

  // Return slots that are not booked
  return allSlots.filter(slot => !bookedSlots.includes(slot));
}
