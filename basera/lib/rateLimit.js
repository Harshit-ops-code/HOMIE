const LIMIT_WINDOW = parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000"); // 1 minute default
const AUTH_LIMIT = parseInt(process.env.RATE_LIMIT_AUTH_MAX || "5");       // Max 5 attempts
const PUBLIC_LIMIT = parseInt(process.env.RATE_LIMIT_PUBLIC_MAX || "60");  // Max 60 requests/min
const USER_LIMIT = parseInt(process.env.RATE_LIMIT_USER_MAX || "120");     // Max 120 requests/min

// In-memory stores
const ipStore = new Map();
const authAttemptStore = new Map(); // tracks email attempts for backoff

export function getClientIp(req) {
  // Try common headers
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp;
  return '127.0.0.1'; // fallback
}

/**
 * Basic rate limit check for IPs
 */
export function checkRateLimit(ip, limitType = 'public') {
  const now = Date.now();
  let limit = PUBLIC_LIMIT;
  if (limitType === 'auth') limit = AUTH_LIMIT;
  if (limitType === 'user') limit = USER_LIMIT;

  const record = ipStore.get(ip) || { count: 0, resetTime: now + LIMIT_WINDOW };

  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + LIMIT_WINDOW;
  } else {
    record.count++;
  }

  ipStore.set(ip, record);

  const remaining = Math.max(0, limit - record.count);
  const resetSeconds = Math.ceil((record.resetTime - now) / 1000);

  return {
    allowed: record.count <= limit,
    limit,
    remaining,
    resetSeconds
  };
}

/**
 * Exponential backoff check for auth routes (like login attempts per email/IP combo)
 * Returns { allowed: boolean, waitTimeMs: number }
 */
export function checkAuthBackoff(key) {
  const now = Date.now();
  const record = authAttemptStore.get(key) || { attempts: 0, lastAttempt: 0 };

  if (record.attempts > 0) {
    // Calculate exponential delay: 2^(attempts - 1) * 1000ms (e.g. 1s, 2s, 4s, 8s, 16s, etc. capped at 60s)
    const delay = Math.min(Math.pow(2, record.attempts - 1) * 1000, 60000);
    const timeSinceLast = now - record.lastAttempt;
    if (timeSinceLast < delay) {
      return {
        allowed: false,
        waitTimeMs: delay - timeSinceLast,
        attempts: record.attempts
      };
    }
  }

  return {
    allowed: true,
    waitTimeMs: 0,
    attempts: record.attempts
  };
}

/**
 * Record a failed auth attempt to increase the backoff penalty
 */
export function recordFailedAuth(key) {
  const record = authAttemptStore.get(key) || { attempts: 0, lastAttempt: 0 };
  record.attempts++;
  record.lastAttempt = Date.now();
  authAttemptStore.set(key, record);
}

export function resetFailedAuth(key) {
  authAttemptStore.delete(key);
}

// AI Cost Control Store: Max 100 queries per IP per day
const aiCallStore = new Map();
const AI_DAILY_MAX_CALLS = 100;

export function checkAICostLimit(ip) {
  const now = Date.now();
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;

  const record = aiCallStore.get(ip) || { count: 0, resetTime: now + ONE_DAY_MS };

  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + ONE_DAY_MS;
  } else {
    record.count++;
  }

  aiCallStore.set(ip, record);

  return {
    allowed: record.count <= AI_DAILY_MAX_CALLS,
    count: record.count,
    limit: AI_DAILY_MAX_CALLS
  };
}
