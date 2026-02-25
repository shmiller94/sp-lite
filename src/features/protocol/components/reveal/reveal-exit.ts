const STORAGE_KEY = 'protocol-reveal-exit-target';
// In-memory fallback for immediate redirects (e.g., if sessionStorage is blocked).
let inMemoryExitTarget: string | null = null;

export function setRevealExitTarget(target: string) {
  if (typeof window === 'undefined') return;
  inMemoryExitTarget = target;
  try {
    sessionStorage.setItem(STORAGE_KEY, target);
  } catch (error) {
    console.warn('Failed to store reveal exit target:', error);
  }
}

export function consumeRevealExitTarget(): string | null {
  if (inMemoryExitTarget) {
    const target = inMemoryExitTarget;
    inMemoryExitTarget = null;
    return target;
  }
  if (typeof window === 'undefined') return null;
  try {
    const target = sessionStorage.getItem(STORAGE_KEY);
    if (target) {
      sessionStorage.removeItem(STORAGE_KEY);
      return target;
    }
  } catch (error) {
    console.warn('Failed to read reveal exit target:', error);
  }
  return null;
}
