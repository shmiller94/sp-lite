import moment from 'moment';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Body1, Body3, H2, H3 } from '@/components/ui/typography';
import { useOnboarding } from '@/features/onboarding/stores/onboarding-store';
import { useUpdateOrder } from '@/features/orders/api';
import { useStepper } from '@/lib/stepper';
import { OrderStatus } from '@/types/api';

const EventServiceCard = () => {
  return (
    <div className="space-y-3 rounded-2xl border border-zinc-200 p-6">
      <H3 className="text-zinc-700">Event</H3>
      <div className="space-y-2">
        <Body1 className="text-zinc-500">
          An in-person blood draw hosted at an upcoming Superpower Event.
        </Body1>
        <Body3 className="text-zinc-500">
          Note: This should only be booked under special direction.
        </Body3>
      </div>
    </div>
  );
};

export const Event = () => {
  const { jump, prevStep } = useStepper((s) => s);
  const { slots } = useOnboarding();
  const updateOrderMutation = useUpdateOrder();

  const confirm = async () => {
    if (!slots.blood.orderId) {
      toast.warning('No order found.');
      return;
    }

    await updateOrderMutation.mutateAsync({
      orderId: slots.blood.orderId,
      data: {
        location: {
          address: {
            line: ['Event - Superpower'],
            city: 'San Francisco',
            state: 'CA',
            postalCode: '94103',
          },
        },
        timezone: moment.tz.guess(),
        timestamp: new Date().toISOString(),
        status: OrderStatus.upcoming,
      },
    });

    jump('booking-success');
  };

  return (
    <section id="main" className="space-y-16">
      <>
        <div className="space-y-4">
          <H2 className="text-zinc-900">Service type</H2>
          <EventServiceCard />
        </div>
        <div className="flex items-center justify-end">
          <div className="space-x-4">
            <Button variant="outline" onClick={prevStep}>
              Back
            </Button>
            <Button onClick={confirm}>Confirm</Button>
          </div>
        </div>
      </>
    </section>
  );
};
