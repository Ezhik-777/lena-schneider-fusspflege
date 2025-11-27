// Script to setup Telegram webhook
// Run with: npx tsx scripts/setup-telegram-webhook.ts

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBHOOK_URL = process.env.TELEGRAM_WEBHOOK_URL || 'https://fusspflege-lena-schneider.de/api/telegram';

async function setupWebhook() {
  if (!TELEGRAM_BOT_TOKEN) {
    console.error('❌ TELEGRAM_BOT_TOKEN not found in environment variables');
    process.exit(1);
  }

  console.log('🔧 Setting up Telegram webhook...');
  console.log('📍 Webhook URL:', WEBHOOK_URL);

  try {
    // Set webhook
    const setWebhookUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook`;
    const response = await fetch(setWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: WEBHOOK_URL,
        allowed_updates: ['callback_query', 'message'],
      }),
    });

    const result = await response.json();

    if (result.ok) {
      console.log('✅ Webhook set successfully!');
      console.log('📊 Result:', result);
    } else {
      console.error('❌ Failed to set webhook:', result);
      process.exit(1);
    }

    // Get webhook info to verify
    const getInfoUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getWebhookInfo`;
    const infoResponse = await fetch(getInfoUrl);
    const info = await infoResponse.json();

    console.log('\n📋 Current webhook info:');
    console.log(JSON.stringify(info.result, null, 2));

    if (info.result.url === WEBHOOK_URL) {
      console.log('\n✅ Webhook is active and working!');
    } else {
      console.log('\n⚠️ Webhook URL mismatch!');
      console.log('Expected:', WEBHOOK_URL);
      console.log('Actual:', info.result.url);
    }
  } catch (error) {
    console.error('❌ Error setting webhook:', error);
    process.exit(1);
  }
}

setupWebhook();
