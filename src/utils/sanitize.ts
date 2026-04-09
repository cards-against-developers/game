export const MAX_USERNAME_LENGTH = 16;
export const MIN_USERNAME_LENGTH = 3;
export const MAX_SEED_LENGTH = 64;

export function sanitizeUsername(value: string): string {
  const trimmed = value.trim().replace(/\s+/g, " ");
  return trimmed.slice(0, MAX_USERNAME_LENGTH);
}

export function isValidUsername(value: string): boolean {
  return sanitizeUsername(value).length >= MIN_USERNAME_LENGTH;
}

export function getUsernameValidationMessage(value: string): string {
  return isValidUsername(value)
    ? ""
    : `Username must be at least ${MIN_USERNAME_LENGTH} characters.`;
}

export function sanitizeSeed(value: string): string {
  const trimmed = value.trim().replace(/\s+/g, " ");
  return (trimmed || "cards-against-developers").slice(0, MAX_SEED_LENGTH);
}
