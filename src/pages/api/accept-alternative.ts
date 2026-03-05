import type { APIRoute } from 'astro';
import { getBookingByAlternativeToken, acceptAlternative } from '@/lib/db';
import { sendTelegramMessage } from '@/lib/api-helpers';
import { Resend } from 'resend';
import { getBookingStatusEmail } from '@/lib/email-templates';

function htmlPage(title: string, icon: string, heading: string, body: string, color: string): string {
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} – Lena Schneider Fußpflege</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f3f4f6; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; }
    .card { background: #fff; border-radius: 20px; padding: 48px 40px; max-width: 480px; width: 100%; text-align: center; box-shadow: 0 8px 40px rgba(0,0,0,0.10); }
    .icon { font-size: 64px; margin-bottom: 20px; }
    h1 { font-size: 26px; font-weight: 700; color: ${color}; margin-bottom: 12px; }
    p { color: #6b7280; font-size: 15px; line-height: 1.7; margin-bottom: 10px; }
    .detail { background: #f9fafb; border-radius: 12px; padding: 18px 20px; margin: 24px 0; text-align: left; border-left: 4px solid ${color}; }
    .detail p { margin: 6px 0; color: #374151; font-size: 15px; }
    .detail strong { color: #111827; }
    a.btn { display: inline-block; margin-top: 24px; background: ${color}; color: white; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-size: 15px; font-weight: 600; }
    .footer { margin-top: 32px; font-size: 13px; color: #9ca3af; }
    .footer a { color: #6b7280; text-decoration: none; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">${icon}</div>
    <h1>${heading}</h1>
    ${body}
    <div class="footer">
      <a href="https://fusspflege-lena-schneider.de">fusspflege-lena-schneider.de</a>
    </div>
  </div>
</body>
</html>`;
}

export const GET: APIRoute = async ({ url, request }) => {
  const token = url.searchParams.get('token');

  if (!token) {
    return new Response(
      htmlPage(
        'Ungültiger Link',
        '❌',
        'Ungültiger Link',
        `<p>Dieser Link ist ungültig oder abgelaufen.</p>
         <p>Bitte kontaktieren Sie uns direkt:</p>
         <p><strong>📞 +49 176 34237368</strong></p>`,
        '#dc2626'
      ),
      { status: 400, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }

  let booking;
  try {
    booking = await getBookingByAlternativeToken(token);
  } catch (e) {
    console.error('DB error in accept-alternative:', e);
    return new Response(
      htmlPage(
        'Fehler',
        '⚠️',
        'Technischer Fehler',
        `<p>Ein technischer Fehler ist aufgetreten. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt.</p>
         <p><strong>📞 +49 176 34237368</strong></p>`,
        '#d97706'
      ),
      { status: 500, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }

  if (!booking) {
    return new Response(
      htmlPage(
        'Link nicht gefunden',
        '🔍',
        'Link nicht gefunden',
        `<p>Dieser Bestätigungslink ist ungültig oder wurde bereits verwendet.</p>
         <p>Bei Fragen melden Sie sich gerne: <strong>📞 +49 176 34237368</strong></p>`,
        '#6b7280'
      ),
      { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }

  // Already accepted or confirmed
  if (booking.status === 'confirmed' && booking.alternative_accepted_at) {
    const altDate = booking.alternative_date
      ? new Date(booking.alternative_date).toLocaleDateString('de-DE', {
          weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
        })
      : '';

    return new Response(
      htmlPage(
        'Bereits bestätigt',
        '✅',
        'Termin bereits bestätigt',
        `<p>Sie haben diesen Alternativtermin bereits angenommen.</p>
         <div class="detail">
           <p>💅 <strong>${booking.leistung}</strong></p>
           <p>📅 <strong>${altDate}</strong></p>
           <p>🕐 <strong>${booking.alternative_time} Uhr</strong></p>
         </div>
         <p>Wir freuen uns auf Ihren Besuch!</p>`,
        '#059669'
      ),
      { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }

  if (booking.status !== 'alternative_proposed') {
    return new Response(
      htmlPage(
        'Link abgelaufen',
        '⏰',
        'Link nicht mehr gültig',
        `<p>Dieser Link ist nicht mehr gültig. Der Termin wurde möglicherweise bereits anderweitig vergeben.</p>
         <p>Bitte nehmen Sie Kontakt auf: <strong>📞 +49 176 34237368</strong></p>`,
        '#6b7280'
      ),
      { status: 410, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }

  // Accept the alternative
  try {
    await acceptAlternative(booking.id);
  } catch (e) {
    console.error('Error accepting alternative:', e);
    return new Response(
      htmlPage(
        'Fehler',
        '⚠️',
        'Bestätigung fehlgeschlagen',
        `<p>Leider ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie uns:</p>
         <p><strong>📞 +49 176 34237368</strong></p>`,
        '#d97706'
      ),
      { status: 500, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }

  // Send confirmation email to client
  const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;
  if (RESEND_API_KEY && booking.email) {
    try {
      const resend = new Resend(RESEND_API_KEY);
      await resend.emails.send({
        from: 'Lena Schneider Fußpflege <info@fusspflege-lena-schneider.de>',
        to: [booking.email],
        subject: 'Terminbestätigung - Ihr Termin ist bestätigt!',
        html: getBookingStatusEmail({
          vorname: booking.vorname,
          nachname: booking.nachname,
          leistung: booking.leistung,
          wunschtermin: booking.alternative_date || booking.wunschtermin,
          wunschuhrzeit: booking.alternative_time || booking.wunschuhrzeit,
          status: 'confirmed',
        }),
      });
    } catch (e) {
      console.error('Confirmation email error after alternative accepted:', e);
    }
  }

  // Notify Telegram
  const altDateFormatted = booking.alternative_date
    ? new Date(booking.alternative_date).toLocaleDateString('de-DE', {
        weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
      })
    : 'Unbekannt';

  try {
    await sendTelegramMessage(
      `✅ <b>Kunde hat Alternativtermin angenommen!</b>\n\n` +
      `👤 <b>Kunde:</b> ${booking.vorname} ${booking.nachname}\n` +
      `📞 <b>Telefon:</b> <code>${booking.telefon}</code>\n` +
      `📧 <b>Email:</b> ${booking.email || 'Nicht angegeben'}\n\n` +
      `💅 <b>Leistung:</b> ${booking.leistung}\n` +
      `📅 <b>Neuer Termin:</b> ${altDateFormatted}\n` +
      `🕐 <b>Uhrzeit:</b> ${booking.alternative_time} Uhr\n\n` +
      `✓ Buchung #${booking.id} ist jetzt bestätigt.`
    );
  } catch (e) { console.error('Telegram notify error:', e); }

  const altDateDisplay = booking.alternative_date
    ? new Date(booking.alternative_date).toLocaleDateString('de-DE', {
        weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
      })
    : '';

  return new Response(
    htmlPage(
      'Termin bestätigt',
      '🎉',
      'Termin bestätigt!',
      `<p>Vielen Dank! Ihr Alternativtermin wurde erfolgreich bestätigt.</p>
       <div class="detail">
         <p>💅 <strong>${booking.leistung}</strong></p>
         <p>📅 <strong>${altDateDisplay}</strong></p>
         <p>🕐 <strong>${booking.alternative_time} Uhr</strong></p>
       </div>
       <p>Wir freuen uns auf Ihren Besuch!</p>
       <p style="font-size:13px; color:#9ca3af; margin-top:12px;">
         📍 Löchgauer Str. 17, 74391 Erligheim
       </p>
       <a class="btn" href="https://fusspflege-lena-schneider.de">Zur Website</a>`,
      '#059669'
    ),
    { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  );
};
