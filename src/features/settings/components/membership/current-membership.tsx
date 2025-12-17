import { format } from 'date-fns';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { H4 } from '@/components/ui/typography';
import { useSubscriptions } from '@/features/settings/api';
import { cn } from '@/lib/utils';

export const CurrentMembership = (): JSX.Element => {
  const { data: subscriptionsData, isLoading } = useSubscriptions();
  const superpowerMembership = subscriptionsData?.subscriptions.find(
    (subscription) => subscription.name === 'membership',
  );

  return (
    <div className="rounded-2xl lg:flex lg:flex-row lg:items-center lg:justify-between lg:bg-white lg:p-4">
      <div className="hidden space-y-1 lg:block">
        <H4 className="text-zinc-400">Current Membership</H4>
      </div>

      {isLoading ? (
        <Skeleton className="h-[96px] w-full rounded-xl lg:w-[377px]" />
      ) : (
        <div className="flex flex-row gap-x-2">
          <Card className="w-full rounded-2xl px-5 py-4 shadow-none lg:bg-transparent">
            <div className="flex flex-col">
              <span className="text-xs text-zinc-400 md:text-sm">
                {superpowerMembership?.status === 'canceled'
                  ? 'End date'
                  : 'Renewal Date'}
              </span>
              <span className="text-nowrap lg:text-xl">
                {superpowerMembership
                  ? format(
                      new Date(superpowerMembership.current_period_end * 1000),
                      'PP',
                    )
                  : 'Never'}
              </span>
            </div>
          </Card>
          {superpowerMembership?.status === 'canceled' ? (
            <div className="my-3 hidden border-l border-zinc-100 lg:block" />
          ) : null}
          {superpowerMembership?.status === 'canceled' ? (
            <Card
              className={cn(
                `w-full px-5 rounded-2xl shadow-none py-4 lg:bg-transparent pointer-events-none`,
              )}
            >
              <div className="flex flex-col">
                <span className="text-xs text-zinc-400 md:text-sm">
                  Canceled at
                </span>
                {superpowerMembership?.canceled_at ? (
                  <span className="text-nowrap lg:text-xl">
                    {format(
                      new Date(superpowerMembership.canceled_at * 1000),
                      'PP',
                    )}
                  </span>
                ) : null}
              </div>
            </Card>
          ) : null}
        </div>
      )}
    </div>
  );
};
