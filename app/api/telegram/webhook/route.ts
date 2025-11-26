import { NextRequest, NextResponse } from 'next/server';
import { Telegraf, Markup } from 'telegraf';
import { updateBookingStatus, getBookingById, blockDate, unblockDate, getBlockedDates, getPendingBookings } from '@/lib/db';
import { Resend } from 'resend';
import { getBookingConfirmationEmail } from '@/lib/email-templates';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const LENA_CHAT_ID = process.env.TELEGRAM_CHAT_ID!;

const bot = new Telegraf(BOT_TOKEN);
const resend = new Resend(process.env.RESEND_API_KEY!);

// Handle callback queries (button clicks)
bot.on('callback_query', async (ctx) => {
  // Type guard to check if callback query has data
  if (!('data' in ctx.callbackQuery)) return;

  const callbackData = ctx.callbackQuery.data;
  if (!callbackData) return;

  // Parse callback data: "confirm_123" or "reject_123"
  const [action, bookingIdStr] = callbackData.split('_');
  const bookingId = parseInt(bookingIdStr);

  if (!bookingId) {
    await ctx.answerCbQuery('❌ Ungültige Buchungs-ID');
    return;
  }

  // Get booking details
  const booking = await getBookingById(bookingId);

  if (!booking) {
    await ctx.answerCbQuery('❌ Buchung nicht gefunden');
    return;
  }

  if (booking.status !== 'pending') {
    await ctx.answerCbQuery('⚠️ Diese Buchung wurde bereits bearbeitet');
    return;
  }

  if (action === 'confirm') {
    // Update status to confirmed
    await updateBookingStatus(bookingId, 'confirmed');

    // Send confirmation email to customer
    if (booking.email) {
      try {
        const emailHtml = getBookingConfirmationEmail({
          vorname: booking.vorname,
          nachname: booking.nachname,
          email: booking.email,
          telefon: booking.telefon,
          leistung: booking.leistung,
          wunschtermin: booking.wunschtermin,
          wunschuhrzeit: booking.wunschuhrzeit,
          nachricht: booking.nachricht || '',
        });

        await resend.emails.send({
          from: 'Lena Schneider Fußpflege <info@fusspflege-lena-schneider.de>',
          to: [booking.email],
          subject: '✅ Terminbestätigung - Ihr Termin ist bestätigt!',
          html: emailHtml,
        });
      } catch (error) {
        console.error('Error sending confirmation email:', error);
      }
    }

    // Update message with confirmation
    const originalText = ctx.callbackQuery.message && 'text' in ctx.callbackQuery.message
      ? ctx.callbackQuery.message.text
      : '';

    await ctx.editMessageText(
      `✅ <b>BESTÄTIGT</b>\n\n${originalText}\n\n✅ Bestätigung wurde an den Kunden gesendet.`,
      { parse_mode: 'HTML' }
    );

    await ctx.answerCbQuery('✅ Termin bestätigt!');

  } else if (action === 'reject') {
    // Update status to rejected
    await updateBookingStatus(bookingId, 'rejected');

    // TODO: Send rejection email to customer

    // Update message with rejection
    const originalText = ctx.callbackQuery.message && 'text' in ctx.callbackQuery.message
      ? ctx.callbackQuery.message.text
      : '';

    await ctx.editMessageText(
      `❌ <b>ABGELEHNT</b>\n\n${originalText}\n\n❌ Termin wurde abgelehnt.`,
      { parse_mode: 'HTML' }
    );

    await ctx.answerCbQuery('❌ Termin abgelehnt');
  }
});

// Handle /start command
bot.command('start', async (ctx) => {
  await ctx.reply(
    '👋 Hallo Lena!\n\n' +
    'Ich bin dein Buchungs-Assistent.\n\n' +
    '📋 Verfügbare Befehle:\n' +
    '/pending - Zeige offene Buchungen\n' +
    '/block_date - Datum blockieren\n' +
    '/unblock_date - Datum freigeben\n' +
    '/blocked - Zeige blockierte Daten\n\n' +
    'Bei neuen Buchungen wirst du automatisch benachrichtigt!'
  );
});

// Handle /pending command - show pending bookings
bot.command('pending', async (ctx) => {
  try {
    const pendingBookings = await getPendingBookings();

    if (pendingBookings.length === 0) {
      await ctx.reply('✅ Keine offenen Buchungen!');
      return;
    }

    await ctx.reply(`📋 Offene Buchungen: ${pendingBookings.length}`);

  for (const booking of pendingBookings) {
    const message = `
🆕 <b>Buchung #${booking.id}</b>

👤 <b>Kunde:</b> ${booking.vorname} ${booking.nachname}
📞 <b>Telefon:</b> <code>${booking.telefon}</code>
📧 <b>Email:</b> ${booking.email || 'Nicht angegeben'}

💅 <b>Leistung:</b> ${booking.leistung}
📅 <b>Termin:</b> ${new Date(booking.wunschtermin).toLocaleDateString('de-DE')}
🕐 <b>Uhrzeit:</b> ${booking.wunschuhrzeit}

📝 <b>Nachricht:</b>
${booking.nachricht || 'Keine Nachricht'}

⏰ <b>Eingegangen:</b> ${new Date(booking.created_at).toLocaleString('de-DE')}
    `.trim();

    await ctx.reply(message, {
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard([
        [
          Markup.button.callback('✅ Bestätigen', `confirm_${booking.id}`),
          Markup.button.callback('❌ Ablehnen', `reject_${booking.id}`),
        ],
      ]),
    });
  }
  } catch (error) {
    console.error('Error in /pending command:', error);
    await ctx.reply('❌ Fehler beim Abrufen der Buchungen. Ist die Datenbank konfiguriert?');
  }
});

// Handle /blocked command - show blocked dates
bot.command('blocked', async (ctx) => {
  try {
    const blockedDates = await getBlockedDates();

  if (blockedDates.length === 0) {
    await ctx.reply('✅ Keine blockierten Daten!');
    return;
  }

  let message = `🚫 <b>Blockierte Daten (${blockedDates.length}):</b>\n\n`;

  for (const blocked of blockedDates) {
    const date = new Date(blocked.date).toLocaleDateString('de-DE');
    const reason = blocked.reason ? ` - ${blocked.reason}` : '';
    message += `📅 ${date}${reason}\n`;
  }

  await ctx.reply(message, { parse_mode: 'HTML' });
  } catch (error) {
    console.error('Error in /blocked command:', error);
    await ctx.reply('❌ Fehler beim Abrufen der blockierten Daten. Ist die Datenbank konfiguriert?');
  }
});

// Handle /block_date command - block a date
bot.command('block_date', async (ctx) => {
  await ctx.reply(
    '🚫 <b>Datum blockieren</b>\n\n' +
    'Sende das Datum im Format: <code>YYYY-MM-DD</code>\n' +
    'Optional: Füge einen Grund hinzu, z.B.:\n' +
    '<code>2025-12-24 Weihnachten</code>\n\n' +
    'Beispiele:\n' +
    '• <code>2025-12-24</code>\n' +
    '• <code>2025-12-24 Urlaub</code>\n' +
    '• <code>2025-12-31 Silvester</code>',
    { parse_mode: 'HTML' }
  );
});

// Handle /unblock_date command - unblock a date
bot.command('unblock_date', async (ctx) => {
  try {
    const blockedDates = await getBlockedDates();

    if (blockedDates.length === 0) {
      await ctx.reply('✅ Keine blockierten Daten zum Freigeben!');
      return;
    }

    await ctx.reply(
      '✅ <b>Datum freigeben</b>\n\n' +
      'Sende das Datum im Format: <code>YYYY-MM-DD</code>\n\n' +
      'Aktuell blockierte Daten:\n' +
      blockedDates.map(b => `• ${new Date(b.date).toLocaleDateString('de-DE')} (${b.date})`).join('\n'),
      { parse_mode: 'HTML' }
    );
  } catch (error) {
    console.error('Error in /unblock_date command:', error);
    await ctx.reply('❌ Fehler beim Abrufen der blockierten Daten. Ist die Datenbank konfiguriert?');
  }
});

// Handle text messages for date blocking/unblocking
bot.on('text', async (ctx) => {
  try {
    const text = ctx.message.text.trim();

    // Check if message matches date format (YYYY-MM-DD)
    const dateMatch = text.match(/^(\d{4}-\d{2}-\d{2})(?:\s+(.+))?$/);

    if (!dateMatch) {
      // Not a date command, ignore
      return;
    }

    const [, dateStr, reason] = dateMatch;

    // Validate date
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      await ctx.reply('❌ Ungültiges Datum. Bitte verwende das Format YYYY-MM-DD');
      return;
    }

    // Check if date is in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) {
      await ctx.reply('❌ Datum liegt in der Vergangenheit');
      return;
    }

    // Determine action based on previous command context
    // Since Telegram doesn't maintain state easily, we'll make it smart:
    // If date is already blocked, offer to unblock it
    // If date is not blocked, block it

    const blockedDates = await getBlockedDates();
    const isBlocked = blockedDates.some(b => b.date === dateStr);

    if (isBlocked) {
      // Unblock the date
      await unblockDate(dateStr);
      await ctx.reply(
        `✅ <b>Datum freigegeben!</b>\n\n` +
        `📅 ${date.toLocaleDateString('de-DE')}\n` +
        `Das Datum ist jetzt wieder verfügbar für Buchungen.`,
        { parse_mode: 'HTML' }
      );
    } else {
      // Block the date
      await blockDate(dateStr, reason);
      await ctx.reply(
        `🚫 <b>Datum blockiert!</b>\n\n` +
        `📅 ${date.toLocaleDateString('de-DE')}\n` +
        (reason ? `📝 Grund: ${reason}\n` : '') +
        `\nDas Datum ist jetzt nicht mehr verfügbar für Buchungen.`,
        { parse_mode: 'HTML' }
      );
    }
  } catch (error) {
    console.error('Error in date blocking/unblocking:', error);
    await ctx.reply('❌ Fehler beim Blockieren/Freigeben des Datums. Ist die Datenbank konfiguriert?');
  }
});

// Webhook handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Process update with Telegraf
    await bot.handleUpdate(body);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Telegram webhook error:', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

// Health check
export async function GET() {
  return NextResponse.json({ status: 'Telegram bot webhook is running' });
}
