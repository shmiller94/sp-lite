import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { configureAuth } from 'react-query-auth';

import { toast } from '@/components/ui/sonner';
import { env } from '@/config/env';
import { useAnalytics } from '@/hooks/use-analytics';
import { MutationConfig } from '@/lib/react-query';
import { clearActiveLogin, setActiveLogin } from '@/lib/utils';
import {
  LoginAuthenticationResponse,
  OAuthGrantType,
  TokenResponse,
  User,
} from '@/types/api';
import { parseJWTPayload } from '@/utils/jwt';

import { api } from './api-client';
import { authClient } from './auth-client';
import type {
  BaseLoginInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
  SetPasswordInput,
} from './auth-schemas';

export type {
  BaseLoginInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
  SetPasswordInput,
} from './auth-schemas';

export const getUser = (): Promise<User> => {
  return api.get('/auth/me');
};

export const authenticatedUserQueryOptions = () => {
  return queryOptions({
    queryKey: ['authenticated-user'],
    queryFn: getUser,
  });
};

const logout = async (): Promise<void> => {
  await Promise.all([
    authClient.signOut(),
    // Also clear legacy OAuth2 sessions for users who haven't migrated yet.
    api
      .post('oauth2/logout', undefined, { headers: { 'x-hide-toast': 'true' } })
      .catch(() => {}),
  ]);

  return clearActiveLogin();
};

const loginWithEmailAndPassword = async (data: LoginInput): Promise<void> => {
  if (data.authMethod) {
    const response: LoginAuthenticationResponse = await api.post(
      'auth/admin/login',
      { email: data.email, authMethod: data.authMethod },
    );
    if (!response.code) {
      throw new Error('No code found.');
    }
    await processCode(response.code);
    return;
  }

  const { error } = await authClient.signIn.email({
    email: data.email,
    password: data.password,
  });

  if (error) {
    toast.error(error.message);
    throw new Error(error.message);
  }
};

const registerUser = (
  data: RegisterInput,
): Promise<LoginAuthenticationResponse> => {
  const registerData = {
    user: {
      ...data,
      dateOfBirth: new Date(
        Date.UTC(
          data.dateOfBirth.getFullYear(),
          data.dateOfBirth.getMonth(),
          data.dateOfBirth.getDate(),
        ),
      ),
    },
    campaignData: {},
  };
  return api.post('/auth/newuser', registerData);
};

const authConfig = {
  userFn: getUser,
  loginFn: async (data: LoginInput): Promise<User> => {
    await loginWithEmailAndPassword(data);
    return getUser();
  },
  registerFn: async (data: RegisterInput): Promise<User> => {
    const response = await registerUser(data);

    if (!response.code) {
      throw Error('No code found.');
    }

    await processCode(response.code);

    return getUser();
  },
  logoutFn: logout,
};

export const resetPassword = async ({
  data,
}: {
  data: ResetPasswordInput;
}): Promise<void> => {
  const { error } = await authClient.requestPasswordReset({
    email: data.email,
    redirectTo: `${env.APP_URL}/setpassword`,
  });

  if (error) {
    toast.error(error.message);
    throw new Error(error.message);
  }
};

type UseResetPasswordOptions = {
  mutationConfig?: MutationConfig<typeof resetPassword>;
};

export const useResetPassword = ({
  mutationConfig,
}: UseResetPasswordOptions = {}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: resetPassword,
  });
};

export const setPassword = async ({
  data,
  token,
}: {
  data: SetPasswordInput;
  token: string;
}): Promise<void> => {
  const { error } = await authClient.resetPassword({
    newPassword: data.password,
    token,
  });

  if (error) {
    toast.error(error.message);
    throw new Error(error.message);
  }
};

type UseSetPasswordOptions = {
  mutationConfig?: MutationConfig<typeof setPassword>;
};

export const useSetPassword = ({
  mutationConfig,
}: UseSetPasswordOptions = {}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: setPassword,
  });
};

export const { useUser, useLogin, useLogout, useRegister } =
  configureAuth(authConfig);

const impersonateUser = async ({
  userId,
}: {
  userId: string;
}): Promise<void> => {
  const { error } = await authClient.admin.impersonateUser({ userId });

  if (error) {
    toast.error(error.message);
    throw new Error(error.message);
  }
};

export const useImpersonateUser = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { reset } = useAnalytics();

  return useMutation({
    mutationFn: impersonateUser,
    onSuccess: () => {
      reset();
      queryClient.removeQueries();
      void router.invalidate();
    },
  });
};

const stopImpersonating = async (): Promise<void> => {
  const { error } = await authClient.admin.stopImpersonating();

  if (error) {
    toast.error(error.message);
    throw new Error(error.message);
  }
};

export const useStopImpersonating = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { reset } = useAnalytics();

  return useMutation({
    mutationFn: stopImpersonating,
    onSuccess: () => {
      reset();
      queryClient.removeQueries();
      void router.invalidate();
    },
  });
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
    profile: {
      userId: tokens.profile.userId,
    },
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
  } catch {
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
