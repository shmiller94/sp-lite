import { createAuthClient } from 'better-auth/client';
import {
  adminClient,
  emailOTPClient,
  phoneNumberClient,
} from 'better-auth/client/plugins';

import { env } from '@/config/env';

export const authClient = createAuthClient({
  baseURL: env.AUTH_URL,
  plugins: [adminClient(), emailOTPClient(), phoneNumberClient()],
});
