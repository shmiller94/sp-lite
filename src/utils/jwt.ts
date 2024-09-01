import { decodeBase64 } from '@/utils/base64';

/**
 * Decodes a section of a JWT.
 * See: https://tools.ietf.org/html/rfc7519
 * @param payload
 */
function decodePayload(payload: string): Record<string, number | string> {
  const cleanedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
  const decodedPayload = decodeBase64(cleanedPayload);
  const uriEncodedPayload = Array.from(decodedPayload).reduce(
    (acc, char): any => {
      const uriEncodedChar = ('00' + char.charCodeAt(0).toString(16)).slice(-2);
      return `${acc}%${uriEncodedChar}`;
    },
    '',
  );
  const jsonPayload = decodeURIComponent(uriEncodedPayload);
  return JSON.parse(jsonPayload);
}

/**
 * Parses the JWT payload.
 * @param token JWT token
 */
export function parseJWTPayload(
  token: string,
): Record<string, number | string> {
  const payload = token.split('.')[1];
  return decodePayload(payload);
}
