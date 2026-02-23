import { useSearch } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'referral-id';

export const useReferralId = () => {
  const invite = useSearch({ strict: false, select: (s) => s.invite });

  const [storedReferralId, setStoredReferralId] = useState<string | null>(
    () => {
      try {
        return localStorage.getItem(STORAGE_KEY);
      } catch (e) {
        console.warn('Failed to read referral id from localStorage', e);
        return null;
      }
    },
  );

  const inviteValue = invite?.trim();
  const inviteIsValid = inviteValue != null && inviteValue.length > 0;

  useEffect(() => {
    if (!inviteIsValid || inviteValue == null) return;

    try {
      localStorage.setItem(STORAGE_KEY, inviteValue);
      setStoredReferralId(inviteValue);
    } catch (e) {
      console.warn('Failed to persist referral id to localStorage', e);
    }
  }, [inviteIsValid, inviteValue]);

  return inviteIsValid ? inviteValue : storedReferralId;
};
