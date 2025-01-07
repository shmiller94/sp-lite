export const updateAccessCode = (accessCode: string) => {
  localStorage.setItem('superpower-code', accessCode.trim());
};

export const getAccessCode = () =>
  localStorage.getItem('superpower-code')?.trim();
