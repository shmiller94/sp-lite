export const getGenderBasedValue = <T>(
  gender: string | undefined,
  defaultValue: T,
  genderMap: Partial<Record<string, T | undefined>>,
): T => {
  return genderMap[gender ?? ''] ?? defaultValue;
};
