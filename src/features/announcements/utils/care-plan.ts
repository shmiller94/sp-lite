export const AIAP_PUBLISH_CUTOFF_DATE = new Date('2025-09-01');

const STORAGE_KEY_PREFIX = 'care_plan_viewed_';

export const getLocalStorageViewed = (planId: string): string | null => {
  try {
    return localStorage.getItem(`${STORAGE_KEY_PREFIX}${planId}`);
  } catch {
    return null;
  }
};

export const setLocalStorageViewed = (planId: string, timestamp: string) => {
  try {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${planId}`, timestamp);
  } catch (error) {
    console.error('Failed to save to localStorage', error);
  }
};
