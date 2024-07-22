import { HttpResponse, http } from 'msw';

import { env } from '@/config/env';

import { db, persistDb } from '../db';
import { requireAuth, networkDelay } from '../utils';

type MessageBody = {
  body: string;
};

export const messagesHandlers = [
  http.post(`${env.API_URL}/messages`, async ({ request, cookies }) => {
    await networkDelay();

    try {
      const { user, error } = requireAuth(cookies);
      if (error) {
        return HttpResponse.json({ message: error }, { status: 401 });
      }
      const data = (await request.json()) as MessageBody;
      const result = db.message.create({
        ...data,
        userId: user?.id,
      });
      await persistDb('message');
      return HttpResponse.json(result);
    } catch (error: any) {
      return HttpResponse.json(
        { message: error?.message || 'Server Error' },
        { status: 500 },
      );
    }
  }),
];
