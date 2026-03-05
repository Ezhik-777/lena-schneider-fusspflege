import type { APIRoute } from 'astro';
import { Telegraf, Markup } from 'telegraf';
import {
  updateBookingStatus,
  getBookingById,
  blockDate,
  unblockDate,
  getBlockedDates,
  getPendingBookings,
  setBookingAwaitingAlternative,
  setAlternativeProposal,
  getAwaitingAlternativeBooking,
} from '@/lib/db';
import { Resend } from 'resend';
import { getAlternativeProposalEmail, getBookingStatusEmail } from '@/lib/email-templates';
import { generateSecureToken } from '@/lib/security';
import { getServiceDuration } from '@/lib/service-config';

// Parse "action_bookingId" — supports multi-part actions like "reject_final_123"
function parseCallback(data: string): { action: string; bookingId: number } | null {
  const idx = data.lastIndexOf('_');
  if (idx === -1) return null;
  const bookingId = parseInt(data.slice(idx + 1));
  if (isNaN(bookingId)) return null;
  return { action: data.slice(0, idx), bookingId };
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'Nicht angegeben';
  try {
    return new Date(dateStr).toLocaleDateString('de-DE', {
      day: '2-digit', month: 'long', year: 'numeric',
    });
  } catch {
    return 'Ungültiges Datum';
  }
}

// Compute "HH:MM - HH:MM" time range based on service duration
function computeTimeRange(startTime: string, serviceName: string): string {
  const duration = getServiceDuration(serviceName);
  const [h, m] = startTime.split(':').map(Number);
  if (isNaN(h) || isNaN(m)) return startTime;
  const endH = h + duration;
  const endTime = `${String(endH).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  return `${startTime} - ${endTime}`;
}

// Validate that end time doesn't exceed 15:00
function isValidEndTime(startTime: string, serviceName: string): boolean {
  const duration = getServiceDuration(serviceName);
  const [h, m] = startTime.split(':').map(Number);
  if (isNaN(h) || isNaN(m)) return false;
  const endMinutes = (h + duration) * 60 + m;
  return endMinutes <= 15 * 60; // 15:00
}

// Cache bot instance at module level (one per cold start)
let cachedBot: ReturnType<typeof createBot> | null = null;

function createBot() {
  const BOT_TOKEN = import.meta.env.TELEGRAM_BOT_TOKEN;
  if (!BOT_TOKEN) throw new Error('TELEGRAM_BOT_TOKEN is not configured');

  const bot = new Telegraf(BOT_TOKEN);
  const resend = import.meta.env.RESEND_API_KEY ? new Resend(import.meta.env.RESEND_API_KEY) : null;
  const SITE_URL = 'https://fusspflege-lena-schneider.de';

  // ── Callback query handler ──────────────────────────────────────────────────
  bot.on('callback_query', async (ctx) => {
    if (!('data' in ctx.callbackQuery)) return;
    const callbackData = ctx.callbackQuery.data;
    if (!callbackData) return;

    const parsed = parseCallback(callbackData);
    if (!parsed) { await ctx.answerCbQuery('Ungültige Aktion'); return; }

    const { action, bookingId } = parsed;
    const booking = await getBookingById(bookingId);

    if (!booking) { await ctx.answerCbQuery('Buchung nicht gefunden'); return; }

    // ── CONFIRM ──
    if (action === 'confirm') {
      if (booking.status !== 'pending') {
        await ctx.answerCbQuery('Diese Buchung wurde bereits bearbeitet');
        return;
      }

      await updateBookingStatus(bookingId, 'confirmed');

      if (booking.email && resend) {
        try {
          await resend.emails.send({
            from: 'Lena Schneider Fußpflege <info@fusspflege-lena-schneider.de>',
            to: [booking.email],
            subject: 'Terminbestätigung - Ihr Termin ist bestätigt!',
            html: getBookingStatusEmail({
              vorname: booking.vorname,
              nachname: booking.nachname,
              leistung: booking.leistung,
              wunschtermin: booking.wunschtermin,
              wunschuhrzeit: booking.wunschuhrzeit,
              status: 'confirmed',
            }),
          });
        } catch (e) { console.error('Confirmation email error:', e); }
      }

      const originalText = ctx.callbackQuery.message && 'text' in ctx.callbackQuery.message
        ? ctx.callbackQuery.message.text : '';

      await ctx.editMessageText(
        `✅ BESTÄTIGT\n\n${originalText}\n\nBestätigung wurde an den Kunden gesendet.`,
        { parse_mode: 'HTML' }
      );
      await ctx.answerCbQuery('Termin bestätigt!');

    // ── REJECT — show choice ──
    } else if (action === 'reject') {
      if (booking.status !== 'pending') {
        await ctx.answerCbQuery('Diese Buchung wurde bereits bearbeitet');
        return;
      }

      await ctx.editMessageReplyMarkup({
        inline_keyboard: [[
          { text: '🗓 Alternativtermin vorschlagen', callback_data: `propose_${bookingId}` },
          { text: '❌ Endgültig ablehnen', callback_data: `reject_final_${bookingId}` },
        ]],
      });
      await ctx.answerCbQuery('Bitte wähle eine Option');

    // ── PROPOSE ALTERNATIVE ──
    } else if (action === 'propose') {
      if (!['pending', 'awaiting_alternative'].includes(booking.status)) {
        await ctx.answerCbQuery('Diese Buchung kann nicht mehr bearbeitet werden');
        return;
      }

      await setBookingAwaitingAlternative(bookingId);

      const msgText = ctx.callbackQuery.message && 'text' in ctx.callbackQuery.message
        ? ctx.callbackQuery.message.text : '';

      await ctx.editMessageText(
        `${msgText}\n\n⏳ <b>Warte auf Alternativtermin-Eingabe...</b>\n\nBitte schreibe Datum und Uhrzeit im Format:\n<code>TT.MM.JJJJ HH:MM</code>\n\nBeispiel: <code>20.03.2026 10:00</code>`,
        { parse_mode: 'HTML' }
      );
      await ctx.answerCbQuery('Bitte Datum und Uhrzeit eingeben');

    // ── FINAL REJECT ──
    } else if (action === 'reject_final') {
      if (!['pending', 'awaiting_alternative'].includes(booking.status)) {
        await ctx.answerCbQuery('Diese Buchung wurde bereits bearbeitet');
        return;
      }

      await updateBookingStatus(bookingId, 'rejected');

      if (booking.email && resend) {
        try {
          await resend.emails.send({
            from: 'Lena Schneider Fußpflege <info@fusspflege-lena-schneider.de>',
            to: [booking.email],
            subject: 'Terminanfrage abgelehnt - Lena Schneider Fußpflege',
            html: getBookingStatusEmail({
              vorname: booking.vorname,
              nachname: booking.nachname,
              leistung: booking.leistung || '',
              wunschtermin: booking.wunschtermin || '',
              wunschuhrzeit: booking.wunschuhrzeit || '',
              status: 'rejected',
            }),
          });
        } catch (e) { console.error('Rejection email error:', e); }
      }

      const msgText = ctx.callbackQuery.message && 'text' in ctx.callbackQuery.message
        ? ctx.callbackQuery.message.text : '';

      await ctx.editMessageText(
        `❌ ABGELEHNT\n\n${msgText}\n\nAbsage wurde an den Kunden gesendet.`,
        { parse_mode: 'HTML' }
      );
      await ctx.answerCbQuery('Termin endgültig abgelehnt');
    }
  });

  // ── /start ──────────────────────────────────────────────────────────────────
  bot.command('start', async (ctx) => {
    await ctx.reply(
      'Hallo Lena!\n\n' +
      'Ich bin dein Buchungs-Assistent.\n\n' +
      'Verfügbare Befehle:\n' +
      '/pending - Offene Buchungen\n' +
      '/block_date - Datum blockieren\n' +
      '/unblock_date - Datum freigeben\n' +
      '/blocked - Blockierte Daten\n\n' +
      'Bei neuen Buchungen wirst du automatisch benachrichtigt!'
    );
  });

  // ── /pending ─────────────────────────────────────────────────────────────────
  bot.command('pending', async (ctx) => {
    try {
      const pendingBookings = await getPendingBookings();
      if (pendingBookings.length === 0) { await ctx.reply('Keine offenen Buchungen!'); return; }

      await ctx.reply(`Offene Buchungen: ${pendingBookings.length}`);

      for (const b of pendingBookings) {
        const message = `
<b>Buchung #${b.id}</b>

<b>Kunde:</b> ${b.vorname} ${b.nachname}
<b>Telefon:</b> <code>${b.telefon}</code>
<b>Email:</b> ${b.email || 'Nicht angegeben'}

<b>Leistung:</b> ${b.leistung}
<b>Termin:</b> ${new Date(b.wunschtermin).toLocaleDateString('de-DE')}
<b>Uhrzeit:</b> ${b.wunschuhrzeit}

<b>Nachricht:</b>
${b.nachricht || 'Keine Nachricht'}

<b>Eingegangen:</b> ${new Date(b.created_at).toLocaleString('de-DE')}
        `.trim();

        await ctx.reply(message, {
          parse_mode: 'HTML',
          ...Markup.inlineKeyboard([[
            Markup.button.callback('✅ Bestätigen', `confirm_${b.id}`),
            Markup.button.callback('❌ Ablehnen', `reject_${b.id}`),
          ]]),
        });
      }
    } catch (e) {
      console.error('Error in /pending:', e);
      await ctx.reply('Fehler beim Abrufen der Buchungen. Ist die Datenbank konfiguriert?');
    }
  });

  // ── /blocked ─────────────────────────────────────────────────────────────────
  bot.command('blocked', async (ctx) => {
    try {
      const blockedDates = await getBlockedDates();
      if (blockedDates.length === 0) { await ctx.reply('Keine blockierten Daten!'); return; }

      let message = `<b>Blockierte Daten (${blockedDates.length}):</b>\n\n`;
      for (const b of blockedDates) {
        const date = new Date(b.date).toLocaleDateString('de-DE');
        const reason = b.reason ? ` - ${b.reason}` : '';
        message += `${date}${reason}\n`;
      }
      await ctx.reply(message, { parse_mode: 'HTML' });
    } catch (e) {
      console.error('Error in /blocked:', e);
      await ctx.reply('Fehler beim Abrufen der blockierten Daten. Ist die Datenbank konfiguriert?');
    }
  });

  // ── /block_date ───────────────────────────────────────────────────────────────
  bot.command('block_date', async (ctx) => {
    await ctx.reply(
      '<b>Datum blockieren</b>\n\n' +
      'Sende das Datum im Format: <code>YYYY-MM-DD</code>\n' +
      'Optional mit Grund:\n<code>2026-03-24 Urlaub</code>',
      { parse_mode: 'HTML' }
    );
  });

  // ── /unblock_date ─────────────────────────────────────────────────────────────
  bot.command('unblock_date', async (ctx) => {
    try {
      const blockedDates = await getBlockedDates();
      if (blockedDates.length === 0) { await ctx.reply('Keine blockierten Daten zum Freigeben!'); return; }

      await ctx.reply(
        '<b>Datum freigeben</b>\n\nSende das Datum im Format: <code>YYYY-MM-DD</code>\n\nAktuell blockiert:\n' +
        blockedDates.map(b => `- ${new Date(b.date).toLocaleDateString('de-DE')} (${b.date})`).join('\n'),
        { parse_mode: 'HTML' }
      );
    } catch (e) {
      console.error('Error in /unblock_date:', e);
      await ctx.reply('Fehler beim Abrufen der blockierten Daten.');
    }
  });

  // ── Text messages ─────────────────────────────────────────────────────────────
  bot.on('text', async (ctx) => {
    try {
      const text = ctx.message.text.trim();

      // 1. Check if there's a booking awaiting alternative date input
      const awaitingBooking = await getAwaitingAlternativeBooking();
      if (awaitingBooking) {
        // Expect format: DD.MM.YYYY HH:MM
        const altMatch = text.match(/^(\d{2})\.(\d{2})\.(\d{4})\s+(\d{2}):(\d{2})$/);
        if (altMatch) {
          const [, day, month, year, hour, minute] = altMatch;
          const altDate = `${year}-${month}-${day}`;
          const altStartTime = `${hour}:${minute}`;

          // Validate date
          const parsedDate = new Date(`${altDate}T12:00:00`);
          if (isNaN(parsedDate.getTime())) {
            await ctx.reply('Ungültiges Datum. Bitte nochmal versuchen: <code>TT.MM.JJJJ HH:MM</code>', { parse_mode: 'HTML' });
            return;
          }

          // Validate end time doesn't exceed 15:00
          if (!isValidEndTime(altStartTime, awaitingBooking.leistung)) {
            const duration = getServiceDuration(awaitingBooking.leistung);
            const maxStartH = 15 - duration;
            const maxStart = `${String(maxStartH).padStart(2, '0')}:00`;
            await ctx.reply(
              `⚠️ Termin würde nach 15:00 Uhr enden (Dauer: ${duration}h).\n\nSpäteste Startzeit: <b>${maxStart}</b>`,
              { parse_mode: 'HTML' }
            );
            return;
          }

          const altTimeRange = computeTimeRange(altStartTime, awaitingBooking.leistung);

          const token = generateSecureToken();
          await setAlternativeProposal(awaitingBooking.id, altDate, altTimeRange, token);

          // Send email to customer
          if (awaitingBooking.email && resend) {
            try {
              const acceptUrl = `${SITE_URL}/api/accept-alternative?token=${token}`;
              await resend.emails.send({
                from: 'Lena Schneider Fußpflege <info@fusspflege-lena-schneider.de>',
                to: [awaitingBooking.email],
                subject: 'Alternativer Terminvorschlag - Lena Schneider Fußpflege',
                html: getAlternativeProposalEmail({
                  vorname: awaitingBooking.vorname,
                  nachname: awaitingBooking.nachname,
                  leistung: awaitingBooking.leistung || '',
                  originalDate: awaitingBooking.wunschtermin || '',
                  originalTime: awaitingBooking.wunschuhrzeit || '',
                  alternativeDate: altDate,
                  alternativeTime: altTimeRange,
                  acceptUrl,
                }),
              });

              await ctx.reply(
                `✅ <b>Alternativtermin vorgeschlagen!</b>\n\n` +
                `📅 ${parsedDate.toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}\n` +
                `🕐 ${altTimeRange} Uhr\n\n` +
                `📧 Email wurde an ${awaitingBooking.email} gesendet.\n` +
                `Warte auf Antwort des Kunden...`,
                { parse_mode: 'HTML' }
              );
            } catch (emailErr) {
              console.error('Error sending alternative email:', emailErr);
              await ctx.reply('⚠️ Alternativtermin gespeichert, aber E-Mail konnte nicht gesendet werden.');
            }
          } else {
            await ctx.reply(
              `✅ Alternativtermin gespeichert: ${parsedDate.toLocaleDateString('de-DE')} ${altTimeRange}\n` +
              `⚠️ Keine E-Mail-Adresse für diesen Kunden hinterlegt.`
            );
          }
          return;
        }
      }

      // 2. Date blocking/unblocking (YYYY-MM-DD format)
      const dateMatch = text.match(/^(\d{4}-\d{2}-\d{2})(?:\s+(.+))?$/);
      if (dateMatch) {
        const [, dateStr, reason] = dateMatch;
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
          await ctx.reply('Ungültiges Datum. Bitte verwende das Format YYYY-MM-DD');
          return;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (date < today) { await ctx.reply('Datum liegt in der Vergangenheit'); return; }

        const blockedDates = await getBlockedDates();
        const isBlocked = blockedDates.some(b => b.date === dateStr);

        if (isBlocked) {
          await unblockDate(dateStr);
          await ctx.reply(
            `<b>Datum freigegeben!</b>\n\n${date.toLocaleDateString('de-DE')}\nDas Datum ist jetzt wieder verfügbar.`,
            { parse_mode: 'HTML' }
          );
        } else {
          await blockDate(dateStr, reason);
          await ctx.reply(
            `<b>Datum blockiert!</b>\n\n${date.toLocaleDateString('de-DE')}\n${reason ? `Grund: ${reason}\n` : ''}Das Datum ist nicht mehr verfügbar.`,
            { parse_mode: 'HTML' }
          );
        }
      }
    } catch (e) {
      console.error('Error in text handler:', e);
      await ctx.reply('Ein Fehler ist aufgetreten. Ist die Datenbank konfiguriert?');
    }
  });

  return bot;
}

function getBot() {
  if (!cachedBot) {
    cachedBot = createBot();
  }
  return cachedBot;
}

// Webhook handler
export const POST: APIRoute = async ({ request }) => {
  try {
    const bot = getBot();
    const body = await request.json();
    await bot.handleUpdate(body);
    return new Response(JSON.stringify({ ok: true }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Telegram webhook error:', error);
    return new Response(JSON.stringify({ ok: false }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
};

// Health check
export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({ status: 'Telegram bot webhook is running' }), {
    status: 200, headers: { 'Content-Type': 'application/json' },
  });
};
