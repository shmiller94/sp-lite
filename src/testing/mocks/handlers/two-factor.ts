import { HttpResponse, http } from 'msw';

import { env } from '@/config/env';

import { db, persistDb } from '../db';
import { networkDelay, requireAuth } from '../utils';

const MOCK_VALID_OTP_CODE = '11111';

type VerifyOtpBody = {
  code: string;
};

export const twoFactorHandlers = [
  http.post(`${env.API_URL}/send-otp`, async ({ cookies }) => {
    await networkDelay();

    try {
      const { user, error } = requireAuth(cookies);
      if (error) {
        return HttpResponse.json({ message: error }, { status: 401 });
      }
      const result = db.otpCode.create({
        userId: user?.id,
        validated: false,
        code: MOCK_VALID_OTP_CODE,
      });
      await persistDb('otpCode');
      return HttpResponse.json(result);
    } catch (error: any) {
      return HttpResponse.json(
        { message: error?.message || 'Server Error' },
        { status: 500 },
      );
    }
  }),

  http.post(`${env.API_URL}/verify-otp`, async ({ request, cookies }) => {
    await networkDelay();

    try {
      const { user, error } = requireAuth(cookies);
      if (error) {
        return HttpResponse.json({ message: error }, { status: 401 });
      }
      const data = (await request.json()) as VerifyOtpBody;

      try {
        db.otpCode.update({
          where: {
            code: {
              equals: data.code,
            },
            userId: {
              equals: user?.id,
            },
            validated: {
              equals: false,
            },
          },
          data: {
            validated: true,
          },
        });

        await persistDb('otpCode');
      } catch (e) {
        return HttpResponse.json({ success: false }, { status: 200 });
      }

      return HttpResponse.json({ success: true }, { status: 200 });
    } catch (error: any) {
      return HttpResponse.json(
        { message: error?.message || 'Server Error' },
        { status: 500 },
      );
    }
  }),
];
