import { format } from 'date-fns';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Spinner } from '@/components/ui/spinner';
import { H4, Body1 } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import { OrderStatus, RequestGroup } from '@/types/api';

import { useVisibleRequestGroups } from '../../services/hooks/use-visible-request-groups';

import { RequestGroupCard } from './request-group-card';
import { RequestGroupsListListEmpty } from './request-groups-list';

type Group = {
  items: RequestGroup[];
};

function getCompletedTimestamp(rg: RequestGroup): string | undefined {
  return rg.endTimestamp ?? rg.startTimestamp ?? rg.createdAt;
}

function groupByMonth(items: RequestGroup[]): Group[] {
  const groups: Record<string, RequestGroup[]> = {};

  for (const rg of items) {
    const ts = getCompletedTimestamp(rg);
    let bucket = 'unknown';

    if (ts != null) {
      const date = new Date(ts);
      if (!Number.isNaN(date.getTime())) {
        bucket = format(date, 'yyyy-MM');
      }
    }

    if (!groups[bucket]) groups[bucket] = [];
    groups[bucket].push(rg);
  }

  const result: Group[] = [];
  for (const value of Object.values(groups)) {
    result.push({ items: value });
  }
  return result;
}

export const CompletedRequestGroupsList = () => {
  const [collapsibleOpen, setCollapsibleOpen] = useState(false);

  const {
    isLoading,
    visibleRequestGroups,
    restRequestGroups,
    totalFiltered,
    defaultVisible,
  } = useVisibleRequestGroups({ status: OrderStatus.completed });

  if (isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner variant="primary" size="lg" />
      </div>
    );
  }

  if (totalFiltered === 0)
    return <RequestGroupsListListEmpty status={OrderStatus.completed} />;

  const visibleGroups = groupByMonth(visibleRequestGroups);
  const restGroups = groupByMonth(restRequestGroups);

  return (
    <section className="space-y-4">
      <Collapsible open={collapsibleOpen} onOpenChange={setCollapsibleOpen}>
        <div className="space-y-6">
          {visibleGroups.map((group) => {
            const ts = getCompletedTimestamp(group.items[0]);
            let monthLabel = 'Unknown';
            let yearLabel = '';

            if (ts != null) {
              const date = new Date(ts);
              if (!Number.isNaN(date.getTime())) {
                monthLabel = format(date, 'MMMM');
                yearLabel = format(date, 'yyyy');
              }
            }

            return (
              <div key={ts} className="space-y-2">
                <H4>
                  {monthLabel}{' '}
                  <span className="text-secondary">{yearLabel}</span>
                </H4>
                <div className="grid gap-5">
                  <RequestGroupCard requestGroups={group.items} />
                </div>
              </div>
            );
          })}
        </div>

        <CollapsibleContent>
          <div className="mt-6 space-y-6">
            {restGroups.map((group) => {
              const ts = getCompletedTimestamp(group.items[0]);
              let monthLabel = 'Unknown';
              let yearLabel = '';

              if (ts != null) {
                const date = new Date(ts);
                if (!Number.isNaN(date.getTime())) {
                  monthLabel = format(date, 'MMMM');
                  yearLabel = format(date, 'yyyy');
                }
              }

              return (
                <div key={ts} className="space-y-2">
                  <H4>
                    {monthLabel}{' '}
                    <span className="text-secondary">{yearLabel}</span>
                  </H4>
                  <div className="grid gap-5">
                    <RequestGroupCard requestGroups={group.items} />
                  </div>
                </div>
              );
            })}
          </div>
        </CollapsibleContent>

        {totalFiltered > defaultVisible && (
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="small"
              className="mx-auto mt-5 flex flex-row items-center space-x-2 text-secondary"
            >
              <Body1>
                {collapsibleOpen
                  ? 'Collapse'
                  : `${totalFiltered - defaultVisible} more bookings`}
              </Body1>
              <ChevronDown
                className={cn(
                  'size-4 transition-transform duration-300 ease-in-out',
                  collapsibleOpen ? 'rotate-180' : 'rotate-0',
                )}
              />
              <span className="sr-only">
                {collapsibleOpen
                  ? 'Collapse'
                  : `${totalFiltered - defaultVisible} more bookings`}
              </span>
            </Button>
          </CollapsibleTrigger>
        )}
      </Collapsible>
    </section>
  );
};
