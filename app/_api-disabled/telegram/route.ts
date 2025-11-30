import { NextRequest, NextResponse } from 'next/server';
import { updateBookingStatus, getBookingById } from '@/lib/db';
import { Resend } from 'resend';
import { getBookingStatusEmail } from '@/lib/email-templates';

// Telegram webhook endpoint for handling callback queries
export async function POST(request: NextRequest) {
  try {
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

    if (!TELEGRAM_BOT_TOKEN) {
      console.error('TELEGRAM_BOT_TOKEN not configured');
      return NextResponse.json({ error: 'Bot token not configured' }, { status: 500 });
    }

    const data = await request.json();
    console.log('📩 Telegram webhook received:', JSON.stringify(data, null, 2));

    // Handle callback queries (button clicks)
    if (data.callback_query) {
      const callbackQuery = data.callback_query;
      const callbackData = callbackQuery.data; // e.g. "confirm_123" or "reject_123"
      const messageId = callbackQuery.message.message_id;
      const chatId = callbackQuery.message.chat.id;

      // Parse callback data
      const [action, bookingIdStr] = callbackData.split('_');
      const bookingId = parseInt(bookingIdStr);

      if (!bookingId || !['confirm', 'reject'].includes(action)) {
        // Answer callback query with error
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/answerCallbackQuery`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            callback_query_id: callbackQuery.id,
            text: '❌ Ungültige Aktion',
            show_alert: true,
          }),
        });
        return NextResponse.json({ ok: true });
      }

      // Get booking from database
      const booking = await getBookingById(bookingId);

      if (!booking) {
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/answerCallbackQuery`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            callback_query_id: callbackQuery.id,
            text: '❌ Buchung nicht gefunden',
            show_alert: true,
          }),
        });
        return NextResponse.json({ ok: true });
      }

      // Check if already processed
      if (booking.status !== 'pending') {
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/answerCallbackQuery`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            callback_query_id: callbackQuery.id,
            text: `ℹ️ Diese Buchung wurde bereits ${booking.status === 'confirmed' ? 'bestätigt' : 'abgelehnt'}`,
            show_alert: true,
          }),
        });
        return NextResponse.json({ ok: true });
      }

      // Update booking status
      const newStatus = action === 'confirm' ? 'confirmed' : 'rejected';
      await updateBookingStatus(bookingId, newStatus);

      // Format date helper
      const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Nicht angegeben';
        try {
          const date = new Date(dateString);
          return date.toLocaleDateString('de-DE', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
          });
        } catch {
          return 'Ungültiges Datum';
        }
      };

      // Edit message to show status
      const statusEmoji = newStatus === 'confirmed' ? '✅' : '❌';
      const statusText = newStatus === 'confirmed' ? 'BESTÄTIGT' : 'ABGELEHNT';

      const updatedMessage = `
${statusEmoji} <b>${statusText} - Buchung #${bookingId}</b>

👤 <b>Kunde:</b> ${booking.vorname} ${booking.nachname}
📞 <b>Telefon:</b> <code>${booking.telefon}</code>
📧 <b>Email:</b> ${booking.email || 'Nicht angegeben'}

💅 <b>Leistung:</b> ${booking.leistung}
📅 <b>Termin:</b> ${formatDate(booking.wunschtermin)}
🕐 <b>Uhrzeit:</b> ${booking.wunschuhrzeit}

📝 <b>Nachricht:</b>
${booking.nachricht || 'Keine Nachricht'}

⏰ <b>Eingegangen:</b> ${new Date(booking.created_at).toLocaleString('de-DE')}
🔄 <b>Bearbeitet:</b> ${new Date().toLocaleString('de-DE')}
`.trim();

      // Update Telegram message
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/editMessageText`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          message_id: messageId,
          text: updatedMessage,
          parse_mode: 'HTML',
        }),
      });

      // Answer callback query with success message
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/answerCallbackQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callback_query_id: callbackQuery.id,
          text: newStatus === 'confirmed' ? '✅ Buchung bestätigt!' : '❌ Buchung abgelehnt',
        }),
      });

      // Send email to customer
      console.log('📧 Attempting to send email to:', booking.email);

      if (!booking.email) {
        console.warn('⚠️ No email address found in booking #' + bookingId);
      } else {
        const RESEND_API_KEY = process.env.RESEND_API_KEY;

        if (!RESEND_API_KEY) {
          console.error('❌ RESEND_API_KEY not configured');
        } else {
          try {
            const resend = new Resend(RESEND_API_KEY);
            const emailHtml = getBookingStatusEmail({
              vorname: booking.vorname,
              nachname: booking.nachname,
              leistung: booking.leistung || '',
              wunschtermin: booking.wunschtermin || '',
              wunschuhrzeit: booking.wunschuhrzeit || '',
              status: newStatus,
            });

            const subject = newStatus === 'confirmed'
              ? '✅ Ihr Termin wurde bestätigt - Lena Schneider Fußpflege'
              : '❌ Terminanfrage abgelehnt - Lena Schneider Fußpflege';

            console.log('📤 Sending email to:', booking.email, 'Subject:', subject);

            const { data, error } = await resend.emails.send({
              from: 'Lena Schneider Fußpflege <info@fusspflege-lena-schneider.de>',
              to: [booking.email],
              subject,
              html: emailHtml,
            });

            if (error) {
              console.error('❌ Resend API error:', error);
            } else {
              console.log(`✅ ${newStatus === 'confirmed' ? 'Confirmation' : 'Rejection'} email sent to ${booking.email}. Email ID:`, data?.id);
            }
          } catch (emailError) {
            console.error('❌ Exception sending status email:', emailError);
          }
        }
      }

      return NextResponse.json({ ok: true });
    }

    // Handle regular messages (if needed in the future)
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Telegram webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
