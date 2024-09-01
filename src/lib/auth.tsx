import { configureAuth } from 'react-query-auth';
import { Navigate, useLocation } from 'react-router-dom';
import { z } from 'zod';

import { clearActiveLogin, setActiveLogin } from '@/lib/utils';
import {
  LoginAuthenticationResponse,
  OAuthGrantType,
  TokenResponse,
  User,
} from '@/types/api';
import { parseJWTPayload } from '@/utils/jwt';

import { api } from './api-client';

const getUser = (): Promise<User> => {
  return api.get('/auth/me');
};

const logout = async (): Promise<void> => {
  await api.post('oauth2/logout');
  return clearActiveLogin();
};

export const baseLoginInputSchema = z.object({
  redirectUri: z.string().optional(),
});

export const loginInputSchema = baseLoginInputSchema.merge(
  z.object({
    email: z.string().min(1, 'Required').email('Invalid email'),
    password: z.string().min(5, 'Required'),
  }),
);

export type BaseLoginInput = z.infer<typeof baseLoginInputSchema>;

export type LoginInput = z.infer<typeof loginInputSchema>;
const loginWithEmailAndPassword = (
  data: LoginInput,
): Promise<LoginAuthenticationResponse> => {
  return api.post('/auth/login', data);
};

export const registerInputSchema = z.object({
  email: z.string().min(1, 'Required'),
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  password: z.string().min(1, 'Required'),
  gender: z.string().min(1, 'Required'),
  phone: z.string().min(1, 'Required'),
  dateOfBirth: z.string().min(1, 'Required'),
});

export type RegisterInput = z.infer<typeof registerInputSchema>;

const registerWithEmailAndPassword = (
  data: RegisterInput,
): Promise<LoginAuthenticationResponse> => {
  return api.post('/auth/register', data);
};

const authConfig = {
  userFn: getUser,
  loginFn: async (data: LoginInput): Promise<User> => {
    const response = await loginWithEmailAndPassword(data);

    if (!response.code) {
      throw Error('No code found.');
    }

    await processCode(response.code);

    return getUser();
  },
  registerFn: async (data: RegisterInput): Promise<User> => {
    const response = await registerWithEmailAndPassword(data);

    if (!response.code) {
      throw Error('No code found.');
    }

    await processCode(response.code);

    return getUser();
  },
  logoutFn: logout,
};

export const { useUser, useLogin, useLogout, useRegister, AuthLoader } =
  configureAuth(authConfig);

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useUser();
  const location = useLocation();

  if (!user.data) {
    return (
      <Navigate
        to={`/auth/login?redirectTo=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  return children;
};

/**
 * Verifies the tokens received from the auth server.
 * Validates the JWT against the JWKS.
 * See: https://openid.net/specs/openid-connect-core-1_0.html#TokenEndpoint
 * @param tokens
 */
const verifyTokens = async (tokens: TokenResponse) => {
  const token = tokens.access_token;

  // Verify token has not expired
  const tokenPayload = parseJWTPayload(token);
  if (Date.now() >= (tokenPayload.exp as number) * 1000) {
    clearActiveLogin();
    throw new Error('Token expired');
  }

  setActiveLogin({
    accessToken: token,
    refreshToken: tokens.refresh_token,
    profile: tokens.profile,
  });
};

/**
 * Makes a POST request to the tokens endpoint.
 * See: https://openid.net/specs/openid-connect-core-1_0.html#TokenEndpoint
 * @param formBody Token parameters in URL encoded format.
 */
const fetchTokens = async (formBody: URLSearchParams) => {
  try {
    const response: TokenResponse = await api.post('oauth2/token', formBody, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      withCredentials: true,
    });

    await verifyTokens(response);
  } catch (error) {
    clearActiveLogin();
    throw new Error('Failed to fetch tokens');
  }
};

/**
 * Processes an OAuth authorization code.
 * See: https://openid.net/specs/openid-connect-core-1_0.html#TokenRequest
 * @param code The authorization code received by URL parameter.
 * @param loginParams Optional login parameters.
 * @category Authentication
 */
const processCode = (code: string, loginParams?: Partial<BaseLoginInput>) => {
  const formBody = new URLSearchParams();
  formBody.set('grant_type', OAuthGrantType.AuthorizationCode);
  formBody.set('code', code);
  formBody.set('redirect_uri', loginParams?.redirectUri ?? '');

  return fetchTokens(formBody);
};
