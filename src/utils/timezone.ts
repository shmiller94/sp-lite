const TIMEZONE_ALIASES: Record<string, string> = {
  'US/Pacific': 'America/Los_Angeles',
  'US/Mountain': 'America/Denver',
  'US/Central': 'America/Chicago',
  'US/Eastern': 'America/New_York',
};

export function normalizeTimeZone(timeZone: string | null | undefined) {
  if (timeZone == null) return undefined;

  const trimmed = timeZone.trim();
  if (trimmed === '') return undefined;

  return TIMEZONE_ALIASES[trimmed] ?? trimmed;
}

export function getBrowserTimeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'UTC';
  } catch {
    return 'UTC';
  }
}

export function isValidTimeZone(timeZone: string) {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone });
    return true;
  } catch {
    return false;
  }
}

export function resolveTimeZone(preferredTimeZone: string | null | undefined) {
  const normalized = normalizeTimeZone(preferredTimeZone);
  if (normalized != null && isValidTimeZone(normalized)) return normalized;

  return getBrowserTimeZone();
}
