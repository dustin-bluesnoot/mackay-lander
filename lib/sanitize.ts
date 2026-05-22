import validator from 'validator';

export function sanitizeText(input: unknown): string {
  if (typeof input !== 'string') return '';
  return validator.escape(validator.trim(input));
}

export function sanitizeEmail(input: unknown): string {
  if (typeof input !== 'string') return '';
  const trimmed = validator.trim(input).toLowerCase();
  return validator.isEmail(trimmed) ? trimmed : '';
}

export function sanitizeUrl(input: unknown): string {
  if (typeof input !== 'string') return '';
  const trimmed = validator.trim(input);
  if (validator.isURL(trimmed, { protocols: ['http', 'https'], require_protocol: true })) {
    return trimmed;
  }
  return '';
}

export function sanitizePhone(input: unknown): string {
  if (typeof input !== 'string') return '';
  return validator.trim(input).replace(/[^\d\s+\-().]/g, '').slice(0, 30);
}

export function sanitizeLongText(input: unknown): string {
  if (typeof input !== 'string') return '';
  const stripped = validator.stripLow(validator.trim(input));
  return stripped.slice(0, 5000);
}
