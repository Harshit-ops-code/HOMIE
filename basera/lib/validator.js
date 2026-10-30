/**
 * Simple validator utility for input validations
 */

// Email regex validator
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Mongoose ObjectId hex validation (24 hex characters)
const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/;

export function validateEmail(email) {
  if (typeof email !== 'string') return false;
  return EMAIL_REGEX.test(email.trim()) && email.length <= 100;
}

export function validateString(val, minLen = 1, maxLen = 1000) {
  if (typeof val !== 'string') return false;
  const len = val.trim().length;
  return len >= minLen && len <= maxLen;
}

export function validateNumberRange(val, min = 0, max = 1000000) {
  const num = Number(val);
  if (isNaN(num)) return false;
  return num >= min && num <= max;
}

export function validateObjectId(id) {
  if (typeof id !== 'string') return false;
  return OBJECT_ID_REGEX.test(id);
}
