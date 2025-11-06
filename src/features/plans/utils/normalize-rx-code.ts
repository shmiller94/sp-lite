/**
 * Normalizes RX codes to ensure they have the required 'rx-' prefix
 * @param code The RX code that may or may not have the prefix
 * @returns A properly formatted RX code with the 'rx-' prefix
 */
export const normalizeRxCode = (code?: string): string => {
  if (!code) return 'rx-';
  return code.startsWith('rx-') ? code : `rx-${code}`;
};
