import { TZDateMini } from '@date-fns/tz';
import { addDays, addHours, addMinutes, startOfDay } from 'date-fns';
import { http, HttpResponse } from 'msw';

import { env } from '@/config/env';
import { networkDelay, requireAuth } from '@/testing/mocks/utils';

export const phlebotomyHandlers = [
  http.post(`${env.API_URL}/phlebotomy/availability`, async ({ request }) => {
    await networkDelay();

    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];

    try {
      const { error } = await requireAuth(token);
      if (error) {
        return HttpResponse.json({ message: error }, { status: 401 });
      }
      // const data = (await request.json()) as AvailabilityBody;

      // Assuming today's date, and the time slot is fixed from 5 AM to 5:30 AM
      const tomorrowUtc = addDays(new TZDateMini(Date.now(), 'UTC'), 1);
      const slotStartUtc = addHours(startOfDay(tomorrowUtc), 5);
      const slotEndUtc = addMinutes(slotStartUtc, 30);

      const slot = {
        start: slotStartUtc.toISOString(),
        end: slotEndUtc.toISOString(),
      };

      const slots: { start: string; end: string }[] = [];

      slots.push(slot);

      const convertedSlots: Array<{
        start: Date;
        end: Date;
        status: 'free';
      }> = [];

      for (const slot of slots) {
        const startInPhoenix = new TZDateMini(slot.start, 'America/Phoenix');
        const endInPhoenix = new TZDateMini(slot.end, 'America/Phoenix');

        convertedSlots.push({
          start: startInPhoenix,
          end: endInPhoenix,
          status: 'free',
        });
      }

      return HttpResponse.json({
        slots: convertedSlots,
        timezone: 'US/Pacific',
      });
    } catch (error: any) {
      return HttpResponse.json(
        { message: error?.message || 'Server Error' },
        { status: 500 },
      );
    }
  }),
  http.post(`${env.API_URL}/phlebotomy/serviceable`, async () => {
    await networkDelay();

    return HttpResponse.json(
      {
        serviceable: true,
      },
      { status: 200 },
    );
  }),
];
