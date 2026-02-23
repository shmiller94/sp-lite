import { useNavigate, useSearch } from '@tanstack/react-router';
import { useEffect } from 'react';

const STORAGE_KEY = 'bypass';
const BYPASS_CODE = 'superpower-emr';

const readBypassFromSession = () => {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Failed to read maintenance bypass from sessionStorage', e);
    return null;
  }
};

export const useShouldBypassMaintenance = () => {
  const navigate = useNavigate();
  const bypass = useSearch({ strict: false, select: (s) => s.bypass });

  const bypassValue = bypass?.trim();
  const sessionBypass = readBypassFromSession();

  const shouldBypass =
    sessionBypass === BYPASS_CODE || bypassValue === BYPASS_CODE;

  useEffect(() => {
    if (bypassValue !== BYPASS_CODE) return;

    try {
      sessionStorage.setItem(STORAGE_KEY, BYPASS_CODE);
    } catch (e) {
      console.warn('Failed to persist maintenance bypass in sessionStorage', e);
    }

    void navigate({
      to: '.',
      replace: true,
      search: (prev) => {
        return {
          ...prev,
          bypass: undefined,
        };
      },
    });
  }, [bypassValue, navigate]);

  return shouldBypass;
};
