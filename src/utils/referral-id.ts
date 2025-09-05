export const getReferralId = (): string | null => {
  try {
    const params = new URLSearchParams(window.location.search);

    const ref = params.get('invite')?.trim();

    if (ref) {
      localStorage.setItem('referral-id', ref);

      return ref;
    }

    const storedRef = localStorage.getItem('referral-id');

    if (storedRef) {
      return storedRef;
    }

    return null;
  } catch (e) {
    console.warn('Failed to get referral id', e);
    return null;
  }
};
