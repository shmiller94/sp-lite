import { HttpResponse, http } from 'msw';

import { env } from '@/config/env';
import { twoFactorHandlers } from '@/testing/mocks/handlers/two-factor';

import { networkDelay } from '../utils';

import { appointmentsHandlers } from './appointments';
import { authHandlers } from './auth';
import { consultsHandlers } from './consults';
import { messagesHandlers } from './messages';
import { servicesHandlers } from './services';
import { usersHandlers } from './users';

export const handlers = [
  ...appointmentsHandlers,
  ...authHandlers,
  ...consultsHandlers,
  ...messagesHandlers,
  ...servicesHandlers,
  ...usersHandlers,
  ...twoFactorHandlers,
  http.get(`${env.API_URL}/healthcheck`, async () => {
    await networkDelay();
    return HttpResponse.json({ ok: true });
  }),
];
