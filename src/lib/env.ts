/**
 * Environment variable validation
 * Ensures all required environment variables are present at runtime
 */

function getEnv(key: string): string | undefined {
  // Astro uses import.meta.env, fallback to process.env for compatibility
  return (import.meta.env?.[key] ?? process.env[key]) as string | undefined;
}

export function validateEnv() {
  const required = [
    'TELEGRAM_BOT_TOKEN',
    'TELEGRAM_CHAT_ID',
  ];

  const missing = required.filter(key => !getEnv(key));

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n` +
      `   ${missing.join('\n   ')}\n\n` +
      `Please check your .env file and ensure all variables are set.\n` +
      `See .env.example for required variables.`
    );
  }

  // Validate format of Telegram token
  const token = getEnv('TELEGRAM_BOT_TOKEN');
  if (token && !token.match(/^\d+:[A-Za-z0-9_-]+$/)) {
    console.warn(
      'Warning: TELEGRAM_BOT_TOKEN format looks incorrect.\n' +
      '   Expected format: 123456789:ABCdefGHIjklMNOpqrsTUVwxyz'
    );
  }

  // Validate Chat ID format
  const chatId = getEnv('TELEGRAM_CHAT_ID');
  if (chatId && !chatId.match(/^-?\d+$/)) {
    console.warn(
      'Warning: TELEGRAM_CHAT_ID format looks incorrect.\n' +
      '   Expected format: -1234567890 or 1234567890'
    );
  }

  if (import.meta.env?.DEV) {
    console.log('Environment variables validated successfully');
  }
}
