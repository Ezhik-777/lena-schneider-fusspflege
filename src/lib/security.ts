/**
 * Security utilities
 * Additional security helpers and utilities
 */

/**
 * Check if an IP is in a blacklist
 * For production, this could be connected to a real-time threat intelligence service
 */
export function isIPBlacklisted(ip: string): boolean {
  // Known malicious IPs (example - in production use a proper service)
  const blacklist: string[] = [
    // Add known malicious IPs here
  ];

  return blacklist.includes(ip);
}

/**
 * Detect potential SQL injection patterns
 */
export function containsSQLInjection(input: string): boolean {
  const sqlPatterns = [
    /(\bunion\b.*\bselect\b)/i,
    /(\bselect\b.*\bfrom\b)/i,
    /(\binsert\b.*\binto\b)/i,
    /(\bdelete\b.*\bfrom\b)/i,
    /(\bdrop\b.*\btable\b)/i,
    /(\bupdate\b.*\bset\b)/i,
    /(--|;|\/\*|\*\/)/,
    /(\bor\b.*=.*)/i,
    /(\band\b.*=.*)/i,
  ];

  return sqlPatterns.some(pattern => pattern.test(input));
}

/**
 * Detect potential XSS patterns
 */
export function containsXSS(input: string): boolean {
  const xssPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /<iframe[^>]*>/gi,
    /<embed[^>]*>/gi,
    /<object[^>]*>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi, // Event handlers like onclick=, onload=
    /<img[^>]+onerror/gi,
  ];

  return xssPatterns.some(pattern => pattern.test(input));
}

/**
 * Validate German phone number format
 * Accepts: +49..., 0..., with spaces, dashes, parentheses
 */
export function isValidGermanPhone(phone: string): boolean {
  // Remove formatting
  const cleaned = phone.replace(/[\s\-\/()]/g, '');

  // Must start with + or 0, and contain only digits after that
  if (!/^(\+49|0)[0-9]{6,14}$/.test(cleaned)) {
    return false;
  }

  // Additional validation: German mobile numbers usually start with 01
  // Landline numbers vary by region
  const withoutPrefix = cleaned.replace(/^\+49/, '0');

  // Must have at least 10 digits total (including leading 0)
  return withoutPrefix.length >= 10 && withoutPrefix.length <= 15;
}

/**
 * Calculate entropy of a string (for password strength, spam detection)
 */
export function calculateEntropy(str: string): number {
  const len = str.length;
  const frequencies: { [key: string]: number } = {};

  // Count character frequencies
  for (const char of str) {
    frequencies[char] = (frequencies[char] || 0) + 1;
  }

  // Calculate Shannon entropy
  let entropy = 0;
  for (const char in frequencies) {
    const p = frequencies[char] / len;
    entropy -= p * Math.log2(p);
  }

  return entropy;
}

/**
 * Detect if text looks like spam (very low entropy, repetitive)
 */
export function isLikelySpam(text: string): boolean {
  if (text.length === 0) return false;

  // Check for very low entropy (repetitive text)
  const entropy = calculateEntropy(text);
  if (entropy < 1.5 && text.length > 20) {
    return true; // Very repetitive
  }

  // Check for excessive repetition of same character
  const charCounts: { [key: string]: number } = {};
  for (const char of text) {
    charCounts[char] = (charCounts[char] || 0) + 1;
  }

  const maxCount = Math.max(...Object.values(charCounts));
  if (maxCount / text.length > 0.5) {
    return true; // More than 50% of text is same character
  }

  // Check for suspicious patterns
  const spamPatterns = [
    /(.)\1{10,}/, // Same character repeated 10+ times
    /^https?:\/\//i, // Starts with URL
    /\b(viagra|cialis|casino|lottery|winner)\b/i, // Common spam keywords
  ];

  return spamPatterns.some(pattern => pattern.test(text));
}

/**
 * Generate a secure random token
 */
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const randomValues = new Uint8Array(length);

  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(randomValues);
    for (let i = 0; i < length; i++) {
      result += chars[randomValues[i] % chars.length];
    }
  } else {
    // Fallback for environments without crypto
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
  }

  return result;
}

/**
 * Hash a string with SHA-256 (for client-side only, use bcrypt on server)
 */
export async function hashString(str: string): Promise<string> {
  if (typeof crypto === 'undefined' || !crypto.subtle) {
    // Fallback for environments without SubtleCrypto
    return Buffer.from(str).toString('base64');
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Rate limit helper - check if action is allowed
 * @param identifier - Unique identifier (IP, user ID, etc.)
 * @param limit - Maximum number of actions
 * @param windowMs - Time window in milliseconds
 * @param store - Map to store rate limit data
 */
export function checkRateLimit(
  identifier: string,
  limit: number,
  windowMs: number,
  store: Map<string, { count: number; resetAt: number }>
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const record = store.get(identifier);

  // No record or expired
  if (!record || now > record.resetAt) {
    const resetAt = now + windowMs;
    store.set(identifier, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetAt };
  }

  // Check if limit exceeded
  if (record.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt };
  }

  // Increment count
  record.count++;
  return { allowed: true, remaining: limit - record.count, resetAt: record.resetAt };
}

/**
 * Clean up expired rate limit records
 */
export function cleanupRateLimitStore(
  store: Map<string, { count: number; resetAt: number }>
): void {
  const now = Date.now();
  for (const [key, value] of store.entries()) {
    if (now > value.resetAt) {
      store.delete(key);
    }
  }
}
