interface BookingData {
  vorname: string;
  nachname: string;
  email: string;
  telefon: string;
  leistung: string;
  wunschtermin: string;
  wunschuhrzeit: string;
  nachricht?: string;
}

interface ContactData {
  vorname: string;
  nachname: string;
  email: string;
  telefon?: string;
  nachricht: string;
}

export function getBookingConfirmationEmail(data: BookingData): string {
  const formattedDate = new Date(data.wunschtermin).toLocaleDateString('de-DE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `
    <!DOCTYPE html>
    <html lang="de">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Terminanfrage erhalten</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f3f4f6;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
          }
          .header {
            background: linear-gradient(135deg, #2563eb 0%, #0891b2 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
          }
          .header p {
            margin: 10px 0 0 0;
            opacity: 0.95;
            font-size: 16px;
          }
          .content {
            padding: 40px 30px;
          }
          .greeting {
            font-size: 16px;
            margin-bottom: 20px;
          }
          .booking-details {
            background: #f9fafb;
            padding: 25px;
            border-radius: 8px;
            margin: 25px 0;
            border-left: 4px solid #2563eb;
          }
          .booking-details h2 {
            margin-top: 0;
            color: #2563eb;
            font-size: 20px;
            margin-bottom: 20px;
          }
          .detail-row {
            padding: 12px 0;
            border-bottom: 1px solid #e5e7eb;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .detail-row:last-child {
            border-bottom: none;
          }
          .label {
            font-weight: 600;
            color: #374151;
            min-width: 140px;
          }
          .value {
            color: #1f2937;
            text-align: right;
            flex: 1;
          }
          .status-badge {
            display: inline-block;
            background: #ecfdf5;
            color: #059669;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 600;
          }
          .next-steps {
            background: #eff6ff;
            border: 1px solid #bfdbfe;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
          }
          .next-steps h3 {
            margin-top: 0;
            color: #1e40af;
            font-size: 18px;
          }
          .next-steps ul {
            margin: 10px 0;
            padding-left: 20px;
          }
          .next-steps li {
            margin: 8px 0;
            color: #1e3a8a;
          }
          .footer {
            background: #f9fafb;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
          }
          .footer-title {
            font-weight: 600;
            color: #374151;
            margin-bottom: 15px;
            font-size: 16px;
          }
          .contact-info {
            color: #6b7280;
            font-size: 14px;
            line-height: 1.8;
          }
          .contact-info a {
            color: #2563eb;
            text-decoration: none;
          }
          .disclaimer {
            margin-top: 25px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 12px;
            color: #9ca3af;
            line-height: 1.6;
          }
          .signature {
            margin: 30px 0 20px 0;
            font-size: 16px;
          }
          @media only screen and (max-width: 600px) {
            .content {
              padding: 30px 20px;
            }
            .header {
              padding: 30px 20px;
            }
            .detail-row {
              flex-direction: column;
              align-items: flex-start;
            }
            .value {
              text-align: left;
              margin-top: 4px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✨ Terminanfrage erhalten</h1>
            <p>Lena Schneider Fußpflege</p>
          </div>

          <div class="content">
            <div class="greeting">
              Liebe/r ${data.vorname} ${data.nachname},
            </div>

            <p style="font-size: 16px; line-height: 1.6;">
              vielen Dank für Ihre Terminanfrage bei Fußpflege Lena Schneider!
            </p>

            <div style="background: #dbeafe; border: 2px solid #2563eb; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
              <p style="margin: 0; color: #1e40af; font-size: 18px; font-weight: 700;">
                ✓ Ihre Anfrage wurde erhalten!
              </p>
            </div>

            <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 12px; padding: 20px; margin: 20px 0;">
              <p style="margin: 0; color: #0c4a6e; font-size: 15px; line-height: 1.6;">
                <strong style="color: #1e40af;">📧 Wie geht es weiter?</strong><br><br>
                Ich habe Ihre Terminanfrage erhalten und prüfe die Verfügbarkeit.
                Sie erhalten in Kürze eine separate E-Mail mit der <strong>Bestätigung</strong> oder ggf.
                einem alternativen Terminvorschlag.
              </p>
            </div>

            <div class="booking-details">
              <h2 style="color: #2563eb; font-size: 22px; margin-bottom: 20px;">📋 Ihre Buchungsdetails</h2>

              <div class="detail-row">
                <span class="label">Name:</span>
                <span class="value">${data.vorname} ${data.nachname}</span>
              </div>

              <div class="detail-row">
                <span class="label">E-Mail:</span>
                <span class="value">${data.email || 'Nicht angegeben'}</span>
              </div>

              <div class="detail-row">
                <span class="label">Telefon:</span>
                <span class="value">${data.telefon}</span>
              </div>

              <div class="detail-row" style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 10px 0;">
                <span class="label" style="font-size: 16px;">💅 Leistung:</span>
                <span class="value" style="font-size: 17px; font-weight: 700; color: #166534;">${data.leistung}</span>
              </div>

              <div class="detail-row" style="background: #eff6ff; padding: 15px; border-radius: 8px; margin: 10px 0;">
                <span class="label" style="font-size: 16px;">📅 Termin:</span>
                <span class="value" style="font-size: 18px; font-weight: 700; color: #1e40af;">${formattedDate}</span>
              </div>

              <div class="detail-row" style="background: #eff6ff; padding: 15px; border-radius: 8px; margin: 10px 0;">
                <span class="label" style="font-size: 16px;">🕐 Uhrzeit:</span>
                <span class="value" style="font-size: 18px; font-weight: 700; color: #1e40af;">${data.wunschuhrzeit}</span>
              </div>

              ${data.nachricht ? `
              <div class="detail-row">
                <span class="label">Ihre Nachricht:</span>
                <div class="value" style="white-space: pre-wrap; word-wrap: break-word;">${data.nachricht}</div>
              </div>
              ` : ''}

              <div class="detail-row">
                <span class="label">Status:</span>
                <span class="value"><span class="status-badge" style="background: #dbeafe; color: #1e40af;">⏳ Warten auf Bestätigung</span></span>
              </div>
            </div>

            <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 2px solid #f59e0b; border-radius: 16px; padding: 24px; margin: 30px 0; box-shadow: 0 3px 10px rgba(245, 158, 11, 0.15);">
              <h3 style="margin: 0 0 16px 0; color: #92400e; font-size: 19px; font-weight: 700; text-align: center;">
                ⚠️ WICHTIG - STORNIERUNGSBEDINGUNGEN
              </h3>

              <div style="background: #fff8dc; padding: 18px; border-radius: 10px; border: 2px solid #f59e0b; text-align: center; margin-bottom: 16px;">
                <p style="color: #92400e; margin: 0; line-height: 1.5; font-size: 17px; font-weight: 700;">
                  ⚡ Nicht rechtzeitig abgesagte Termine<br>werden mit <span style="font-size: 20px; color: #b45309;">25€</span> berechnet
                </p>
              </div>

              <div style="background: white; border-radius: 10px; padding: 16px;">
                <p style="color: #78350f; margin: 0 0 12px 0; line-height: 1.6; font-size: 15px;">
                  Bitte sagen Sie <strong style="color: #92400e;">mindestens 24 Stunden vorher</strong> ab:
                </p>
                <table cellpadding="0" cellspacing="0" border="0" width="100%" style="font-size: 15px;">
                  <tr>
                    <td style="padding: 6px 0; color: #92400e;">📞</td>
                    <td style="padding: 6px 0 6px 8px;">
                      <a href="tel:+4917634237368" style="color: #2563eb; text-decoration: none; font-weight: 600;">+49 176 34237368</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #92400e;">📧</td>
                    <td style="padding: 6px 0 6px 8px;">
                      <a href="mailto:info@fusspflege-lena-schneider.de" style="color: #2563eb; text-decoration: none; font-weight: 600;">info@fusspflege-lena-schneider.de</a>
                    </td>
                  </tr>
                </table>
                <p style="color: #78350f; margin: 12px 0 0 0; font-size: 14px; line-height: 1.5;">
                  Vielen Dank für Ihr Verständnis! 🙏
                </p>
              </div>
            </div>

            <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border: 1px solid #bae6fd; border-radius: 16px; padding: 24px; margin: 30px 0; box-shadow: 0 2px 8px rgba(14, 165, 233, 0.08);">
              <h3 style="margin: 0 0 18px 0; color: #0c4a6e; font-size: 19px; font-weight: 700; text-align: center;">
                📍 SO FINDEN SIE UNS
              </h3>

              <div style="background: white; border-radius: 10px; padding: 18px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                <table cellpadding="0" cellspacing="0" border="0" width="100%" style="font-size: 15px; line-height: 1.8;">
                  <tr>
                    <td style="padding: 8px 0; color: #1e3a8a; vertical-align: top; width: 30px;">
                      <span style="font-size: 18px;">📍</span>
                    </td>
                    <td style="padding: 8px 0; color: #1f2937;">
                      <strong style="color: #0c4a6e;">Adresse:</strong><br>
                      <span style="color: #374151;">Löchgauer str. 17<br>74391 Erligheim</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #1e3a8a; vertical-align: top;">
                      <span style="font-size: 18px;">📞</span>
                    </td>
                    <td style="padding: 8px 0;">
                      <strong style="color: #0c4a6e;">Telefon:</strong><br>
                      <a href="tel:+4917634237368" style="color: #2563eb; text-decoration: none; font-weight: 600;">+49 176 34237368</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #1e3a8a; vertical-align: top;">
                      <span style="font-size: 18px;">📧</span>
                    </td>
                    <td style="padding: 8px 0;">
                      <strong style="color: #0c4a6e;">E-Mail:</strong><br>
                      <a href="mailto:info@fusspflege-lena-schneider.de" style="color: #2563eb; text-decoration: none; font-weight: 600;">info@fusspflege-lena-schneider.de</a>
                    </td>
                  </tr>
                </table>
              </div>
            </div>

            <div class="signature">
              <p>
                Mit freundlichen Grüßen,<br>
                <strong>Lena Schneider</strong><br>
                <span style="color: #6b7280;">Fußpflege Erligheim</span>
              </p>
            </div>
          </div>

          <div class="footer">
            <div class="footer-title">Kontakt & Informationen</div>

            <div class="contact-info">
              📧 <a href="mailto:info@fusspflege-lena-schneider.de">info@fusspflege-lena-schneider.de</a><br>
              📞 <a href="tel:+4917634237368">+49 176 34237368</a><br>
              🌐 <a href="https://fusspflege-lena-schneider.de">fusspflege-lena-schneider.de</a><br>
              📍 Erligheim
            </div>

            <div class="disclaimer">
              Dies ist eine automatisch generierte Bestätigungs-E-Mail.
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function getContactConfirmationEmail(data: ContactData): string {
  return `
    <!DOCTYPE html>
    <html lang="de">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nachricht erhalten</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f3f4f6;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
          }
          .header {
            background: linear-gradient(135deg, #2563eb 0%, #0891b2 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
          }
          .header p {
            margin: 10px 0 0 0;
            opacity: 0.95;
            font-size: 16px;
          }
          .content {
            padding: 40px 30px;
          }
          .greeting {
            font-size: 16px;
            margin-bottom: 20px;
          }
          .message-box {
            background: #f9fafb;
            padding: 25px;
            border-radius: 8px;
            margin: 25px 0;
            border-left: 4px solid #2563eb;
          }
          .message-box h2 {
            margin-top: 0;
            color: #2563eb;
            font-size: 20px;
            margin-bottom: 15px;
          }
          .next-steps {
            background: #eff6ff;
            border: 1px solid #bfdbfe;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
          }
          .next-steps h3 {
            margin-top: 0;
            color: #1e40af;
            font-size: 18px;
          }
          .next-steps ul {
            margin: 10px 0;
            padding-left: 20px;
          }
          .next-steps li {
            margin: 8px 0;
            color: #1e3a8a;
          }
          .footer {
            background: #f9fafb;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
          }
          .footer-title {
            font-weight: 600;
            color: #374151;
            margin-bottom: 15px;
            font-size: 16px;
          }
          .contact-info {
            color: #6b7280;
            font-size: 14px;
            line-height: 1.8;
          }
          .contact-info a {
            color: #2563eb;
            text-decoration: none;
          }
          .disclaimer {
            margin-top: 25px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 12px;
            color: #9ca3af;
            line-height: 1.6;
          }
          .signature {
            margin: 30px 0 20px 0;
            font-size: 16px;
          }
          @media only screen and (max-width: 600px) {
            .content {
              padding: 30px 20px;
            }
            .header {
              padding: 30px 20px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💌 Nachricht erhalten</h1>
            <p>Lena Schneider Fußpflege</p>
          </div>

          <div class="content">
            <div class="greeting">
              Liebe/r ${data.vorname} ${data.nachname},
            </div>

            <p>vielen Dank für Ihre Nachricht! Ich habe sie erhalten und werde mich so schnell wie möglich bei Ihnen melden.</p>

            <div class="message-box">
              <h2>📨 Ihre Nachricht</h2>
              <p style="color: #1f2937; white-space: pre-wrap;">${data.nachricht}</p>
            </div>

            <div class="next-steps">
              <h3>📞 Wie geht es weiter?</h3>
              <ul>
                <li><strong>Ich melde mich zeitnah bei Ihnen</strong> per E-Mail oder Telefon</li>
                <li>In der Regel antworte ich <strong>innerhalb von 24 Stunden</strong></li>
                <li>Bei dringenden Fragen können Sie mich auch gerne <strong>telefonisch</strong> unter +49 176 34237368 erreichen</li>
              </ul>
            </div>

            <div class="signature">
              <p>
                Mit freundlichen Grüßen,<br>
                <strong>Lena Schneider</strong><br>
                <span style="color: #6b7280;">Fußpflege in Erligheim</span>
              </p>
            </div>
          </div>

          <div class="footer">
            <div class="footer-title">Kontakt & Informationen</div>

            <div class="contact-info">
              📧 <a href="mailto:info@fusspflege-lena-schneider.de">info@fusspflege-lena-schneider.de</a><br>
              📞 <a href="tel:+4917634237368">+49 176 34237368</a><br>
              🌐 <a href="https://fusspflege-lena-schneider.de">fusspflege-lena-schneider.de</a><br>
              📍 Erligheim
            </div>

            <div class="disclaimer">
              Dies ist eine automatisch generierte Bestätigungs-E-Mail.<br>
              Bei Fragen antworten Sie einfach auf diese E-Mail.
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function getBookingStatusEmail(data: {
  vorname: string;
  nachname: string;
  leistung: string;
  wunschtermin: string;
  wunschuhrzeit: string;
  status: 'confirmed' | 'rejected';
}): string {
  const formattedDate = new Date(data.wunschtermin).toLocaleDateString('de-DE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const isConfirmed = data.status === 'confirmed';

  return `
    <!DOCTYPE html>
    <html lang="de">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${isConfirmed ? 'Termin bestätigt' : 'Terminanfrage abgelehnt'}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f3f4f6;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
          }
          .header {
            background: ${isConfirmed ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)' : 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)'};
            color: white;
            padding: 40px 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
          }
          .header p {
            margin: 10px 0 0 0;
            opacity: 0.95;
            font-size: 16px;
          }
          .content {
            padding: 40px 30px;
          }
          .greeting {
            font-size: 16px;
            margin-bottom: 20px;
          }
          .status-box {
            background: ${isConfirmed ? '#d1fae5' : '#fee2e2'};
            border: 2px solid ${isConfirmed ? '#059669' : '#dc2626'};
            border-radius: 12px;
            padding: 20px;
            margin: 25px 0;
            text-align: center;
          }
          .status-box h2 {
            margin: 0;
            color: ${isConfirmed ? '#065f46' : '#991b1b'};
            font-size: 24px;
            font-weight: 700;
          }
          .booking-details {
            background: #f9fafb;
            padding: 25px;
            border-radius: 8px;
            margin: 25px 0;
            border-left: 4px solid ${isConfirmed ? '#10b981' : '#ef4444'};
          }
          .detail-row {
            padding: 12px 0;
            border-bottom: 1px solid #e5e7eb;
          }
          .detail-row:last-child {
            border-bottom: none;
          }
          .label {
            font-weight: 600;
            color: #374151;
            display: block;
            margin-bottom: 4px;
          }
          .value {
            color: #1f2937;
            font-size: 16px;
          }
          .footer {
            background: #f9fafb;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
          }
          .contact-info {
            color: #6b7280;
            font-size: 14px;
            line-height: 1.8;
          }
          .contact-info a {
            color: #2563eb;
            text-decoration: none;
          }
          .signature {
            margin: 30px 0 20px 0;
            font-size: 16px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${isConfirmed ? '✅ Termin bestätigt!' : '❌ Terminanfrage abgelehnt'}</h1>
            <p>Lena Schneider Fußpflege</p>
          </div>

          <div class="content">
            <div class="greeting">
              Liebe/r ${data.vorname} ${data.nachname},
            </div>

            ${isConfirmed ? `
              <p style="font-size: 16px; line-height: 1.6;">
                Ihr Termin wurde erfolgreich bestätigt! Ich freue mich darauf, Sie bald zu sehen.
              </p>

              <div class="status-box">
                <h2>✓ Ihr Termin ist bestätigt!</h2>
              </div>

              <div class="booking-details">
                <h3 style="margin-top: 0; color: #059669;">📋 Termindetails</h3>

                <div class="detail-row">
                  <span class="label">💅 Leistung:</span>
                  <span class="value">${data.leistung}</span>
                </div>

                <div class="detail-row">
                  <span class="label">📅 Termin:</span>
                  <span class="value">${formattedDate}</span>
                </div>

                <div class="detail-row">
                  <span class="label">🕐 Uhrzeit:</span>
                  <span class="value">${data.wunschuhrzeit}</span>
                </div>
              </div>

              <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 2px solid #f59e0b; border-radius: 16px; padding: 24px; margin: 30px 0;">
                <h3 style="margin: 0 0 16px 0; color: #92400e; font-size: 19px; font-weight: 700; text-align: center;">
                  ⚠️ WICHTIG - STORNIERUNGSBEDINGUNGEN
                </h3>
                <div style="background: white; border-radius: 10px; padding: 16px;">
                  <p style="color: #78350f; margin: 0 0 12px 0; line-height: 1.6; font-size: 15px;">
                    Bitte sagen Sie <strong style="color: #92400e;">mindestens 24 Stunden vorher</strong> ab:
                  </p>
                  <p style="margin: 8px 0; color: #92400e;">
                    📞 <a href="tel:+4917634237368" style="color: #2563eb; text-decoration: none; font-weight: 600;">+49 176 34237368</a>
                  </p>
                  <p style="margin: 8px 0; color: #92400e;">
                    📧 <a href="mailto:info@fusspflege-lena-schneider.de" style="color: #2563eb; text-decoration: none; font-weight: 600;">info@fusspflege-lena-schneider.de</a>
                  </p>
                  <p style="color: #78350f; margin: 12px 0 0 0; font-size: 14px;">
                    Nicht rechtzeitig abgesagte Termine werden mit 25€ berechnet.
                  </p>
                </div>
              </div>

              <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border: 1px solid #bae6fd; border-radius: 16px; padding: 24px; margin: 30px 0;">
                <h3 style="margin: 0 0 18px 0; color: #0c4a6e; font-size: 19px; font-weight: 700; text-align: center;">
                  📍 SO FINDEN SIE UNS
                </h3>
                <div style="background: white; border-radius: 10px; padding: 18px;">
                  <p style="margin: 8px 0; color: #374151;">
                    <strong style="color: #0c4a6e;">📍 Adresse:</strong><br>
                    Löchgauer str. 17<br>74391 Erligheim
                  </p>
                  <p style="margin: 8px 0;">
                    <strong style="color: #0c4a6e;">📞 Telefon:</strong><br>
                    <a href="tel:+4917634237368" style="color: #2563eb; text-decoration: none; font-weight: 600;">+49 176 34237368</a>
                  </p>
                </div>
              </div>
            ` : `
              <p style="font-size: 16px; line-height: 1.6;">
                leider musste ich Ihre Terminanfrage ablehnen.
              </p>

              <div class="status-box">
                <h2>Termin nicht verfügbar</h2>
              </div>

              <div class="booking-details">
                <h3 style="margin-top: 0; color: #dc2626;">📋 Angefragte Details</h3>

                <div class="detail-row">
                  <span class="label">💅 Leistung:</span>
                  <span class="value">${data.leistung}</span>
                </div>

                <div class="detail-row">
                  <span class="label">📅 Termin:</span>
                  <span class="value">${formattedDate}</span>
                </div>

                <div class="detail-row">
                  <span class="label">🕐 Uhrzeit:</span>
                  <span class="value">${data.wunschuhrzeit}</span>
                </div>
              </div>

              <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px; margin: 25px 0;">
                <h3 style="margin-top: 0; color: #1e40af; font-size: 18px;">📞 Alternativen finden</h3>
                <p style="color: #1e3a8a; margin: 10px 0;">
                  Bitte kontaktieren Sie mich, um einen alternativen Termin zu vereinbaren:
                </p>
                <p style="margin: 8px 0;">
                  📞 <a href="tel:+4917634237368" style="color: #2563eb; text-decoration: none; font-weight: 600;">+49 176 34237368</a>
                </p>
                <p style="margin: 8px 0;">
                  📧 <a href="mailto:info@fusspflege-lena-schneider.de" style="color: #2563eb; text-decoration: none; font-weight: 600;">info@fusspflege-lena-schneider.de</a>
                </p>
              </div>
            `}

            <div class="signature">
              <p>
                Mit freundlichen Grüßen,<br>
                <strong>Lena Schneider</strong><br>
                <span style="color: #6b7280;">Fußpflege Erligheim</span>
              </p>
            </div>
          </div>

          <div class="footer">
            <div class="contact-info">
              📧 <a href="mailto:info@fusspflege-lena-schneider.de">info@fusspflege-lena-schneider.de</a><br>
              📞 <a href="tel:+4917634237368">+49 176 34237368</a><br>
              🌐 <a href="https://fusspflege-lena-schneider.de">fusspflege-lena-schneider.de</a><br>
              📍 Erligheim
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function getAlternativeProposalEmail(data: {
  vorname: string;
  nachname: string;
  leistung: string;
  originalDate: string;
  originalTime: string;
  alternativeDate: string;
  alternativeTime: string;
  acceptUrl: string;
}): string {
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('de-DE', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

  return `
    <!DOCTYPE html>
    <html lang="de">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Alternativer Terminvorschlag</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f3f4f6; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%); color: white; padding: 40px 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 26px; font-weight: 600; }
          .header p { margin: 10px 0 0 0; opacity: 0.95; font-size: 15px; }
          .content { padding: 40px 30px; }
          .detail-row { padding: 12px 0; border-bottom: 1px solid #e5e7eb; }
          .detail-row:last-child { border-bottom: none; }
          .label { font-weight: 600; color: #374151; display: block; margin-bottom: 4px; }
          .value { color: #1f2937; font-size: 16px; }
          .signature { margin: 30px 0 20px 0; font-size: 16px; }
          .footer { background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb; }
          .contact-info { color: #6b7280; font-size: 14px; line-height: 1.8; }
          .contact-info a { color: #2563eb; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🗓 Alternativer Terminvorschlag</h1>
            <p>Lena Schneider Fußpflege</p>
          </div>

          <div class="content">
            <p style="font-size: 16px;">Liebe/r ${data.vorname} ${data.nachname},</p>

            <p style="font-size: 15px; color: #374151; line-height: 1.7;">
              leider konnte ich Ihren gewünschten Termin nicht bestätigen.
              Ich freue mich jedoch, Ihnen einen <strong>alternativen Termin</strong> anbieten zu können:
            </p>

            <!-- Original request (crossed out) -->
            <div style="background:#fef2f2; border:1px solid #fecaca; border-radius:10px; padding:16px; margin:20px 0;">
              <p style="margin:0 0 6px 0; font-size:13px; color:#991b1b; font-weight:600; text-transform:uppercase; letter-spacing:0.05em;">❌ Ihr Wunschtermin (nicht verfügbar)</p>
              <p style="margin:0; color:#7f1d1d; font-size:15px; text-decoration:line-through;">
                ${formatDate(data.originalDate)} &middot; ${data.originalTime}
              </p>
            </div>

            <!-- Alternative proposal -->
            <div style="background:linear-gradient(135deg,#ecfdf5,#d1fae5); border:2px solid #10b981; border-radius:12px; padding:24px; margin:20px 0; text-align:center;">
              <p style="margin:0 0 8px 0; font-size:13px; color:#065f46; font-weight:700; text-transform:uppercase; letter-spacing:0.08em;">✅ Vorgeschlagener Alternativtermin</p>
              <p style="margin:0; color:#064e3b; font-size:22px; font-weight:700; line-height:1.4;">
                ${formatDate(data.alternativeDate)}
              </p>
              <p style="margin:6px 0 0 0; color:#047857; font-size:20px; font-weight:600;">
                🕐 ${data.alternativeTime} Uhr
              </p>
              <p style="margin:8px 0 0 0; color:#065f46; font-size:14px;">💅 ${data.leistung}</p>
            </div>

            <p style="font-size:15px; color:#374151; line-height:1.7; margin:24px 0 8px 0;">
              Wenn Ihnen dieser Termin passt, klicken Sie bitte auf den Button:
            </p>

            <!-- Accept button -->
            <div style="text-align:center; margin:28px 0;">
              <a href="${data.acceptUrl}"
                style="display:inline-block; background:linear-gradient(135deg,#059669,#10b981); color:white; text-decoration:none; padding:16px 40px; border-radius:12px; font-size:17px; font-weight:700; letter-spacing:0.02em; box-shadow:0 4px 14px rgba(16,185,129,0.35);">
                ✅ Alternativtermin annehmen
              </a>
            </div>

            <p style="font-size:13px; color:#9ca3af; text-align:center; margin:0 0 24px 0;">
              Dieser Link ist einmalig verwendbar.
            </p>

            <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:8px; padding:18px; margin:24px 0;">
              <p style="margin:0 0 8px 0; font-weight:600; color:#1e40af;">📞 Passt der Termin nicht?</p>
              <p style="margin:0; color:#1e3a8a; font-size:14px; line-height:1.6;">
                Melden Sie sich gerne bei mir, damit wir gemeinsam einen passenden Termin finden:<br>
                📞 <a href="tel:+4917634237368" style="color:#2563eb; font-weight:600;">+49 176 34237368</a><br>
                📧 <a href="mailto:info@fusspflege-lena-schneider.de" style="color:#2563eb; font-weight:600;">info@fusspflege-lena-schneider.de</a>
              </p>
            </div>

            <div class="signature">
              <p>Mit freundlichen Grüßen,<br>
              <strong>Lena Schneider</strong><br>
              <span style="color:#6b7280;">Fußpflege Erligheim</span></p>
            </div>
          </div>

          <div class="footer">
            <div class="contact-info">
              📧 <a href="mailto:info@fusspflege-lena-schneider.de">info@fusspflege-lena-schneider.de</a><br>
              📞 <a href="tel:+4917634237368">+49 176 34237368</a><br>
              🌐 <a href="https://fusspflege-lena-schneider.de">fusspflege-lena-schneider.de</a><br>
              📍 Erligheim
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function getContactNotificationEmail(data: ContactData & { ip?: string; submittedAt?: string }): string {
  return `
    <!DOCTYPE html>
    <html lang="de">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Neue Kontaktanfrage</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f3f4f6;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
          }
          .header {
            background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%);
            color: white;
            padding: 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
          }
          .content {
            padding: 30px;
          }
          .detail-row {
            padding: 12px 0;
            border-bottom: 1px solid #e5e7eb;
          }
          .detail-row:last-child {
            border-bottom: none;
          }
          .label {
            font-weight: 600;
            color: #374151;
            display: block;
            margin-bottom: 4px;
          }
          .value {
            color: #1f2937;
          }
          .message-text {
            background: #f9fafb;
            padding: 15px;
            border-radius: 6px;
            margin-top: 8px;
            white-space: pre-wrap;
            border-left: 3px solid #2563eb;
          }
          .meta {
            background: #f3f4f6;
            padding: 15px;
            border-radius: 6px;
            margin-top: 20px;
            font-size: 14px;
            color: #6b7280;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🆕 Neue Kontaktanfrage</h1>
          </div>

          <div class="content">
            <div class="detail-row">
              <span class="label">👤 Name:</span>
              <span class="value">${data.vorname} ${data.nachname}</span>
            </div>

            <div class="detail-row">
              <span class="label">📧 E-Mail:</span>
              <span class="value"><a href="mailto:${data.email}">${data.email}</a></span>
            </div>

            ${data.telefon ? `
            <div class="detail-row">
              <span class="label">📞 Telefon:</span>
              <span class="value"><a href="tel:${data.telefon}">${data.telefon}</a></span>
            </div>
            ` : ''}

            <div class="detail-row">
              <span class="label">📝 Nachricht:</span>
              <div class="message-text">${data.nachricht}</div>
            </div>

            ${data.submittedAt || data.ip ? `
            <div class="meta">
              ${data.submittedAt ? `⏰ Eingegangen: ${new Date(data.submittedAt).toLocaleString('de-DE')}<br>` : ''}
              ${data.ip ? `🌐 IP: ${data.ip}` : ''}
            </div>
            ` : ''}
          </div>
        </div>
      </body>
    </html>
  `;
}
