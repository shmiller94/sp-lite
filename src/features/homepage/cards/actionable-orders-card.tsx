import { ChevronDown, ChevronRight } from 'lucide-react';
import moment from 'moment';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Label } from '@/components/ui/label';
import { Body1, Body2 } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import { OrderStatus } from '@/types/api';
import { getServiceImage } from '@/utils/service';

import { HomepageCard } from '../components/homepage-card';
import { useActionableOrders } from '../hooks/use-actionable-orders';

export const ActionableOrdersCard = () => {
  const { actionableOrders, unseenOrDrafts, hasDrafts, isLoading } =
    useActionableOrders();
  const [isOpen, setIsOpen] = useState(false);

  if (isLoading) {
    return (
      <HomepageCard title="Core action">
        <div className="h-4 w-48 animate-pulse rounded bg-zinc-200" />
      </HomepageCard>
    );
  }

  if (actionableOrders.length === 0) {
    return null;
  }

  const getOrderLink = (
    order: ReturnType<typeof useActionableOrders>['actionableOrders'][0],
  ) => {
    if (order.status === OrderStatus.draft) {
      return `/services/${order.serviceId}`;
    }
    return order.carePlanId
      ? `/plans/${order.carePlanId}`
      : `/services/${order.serviceId}`;
  };

  const renderOrderItem = (
    order: ReturnType<typeof useActionableOrders>['actionableOrders'][0],
  ) => {
    const isDraftOrder = order.status === OrderStatus.draft;
    const isUnseen = !order.lastViewed;
    return (
      <Link
        to={getOrderLink(order)}
        className="group relative flex items-center gap-3 rounded-[20px] border border-vermillion-900 bg-white px-4 py-2 shadow-[0_0_4px_0_rgba(252,95,43,0.5)]"
      >
        <div className="flex shrink-0 items-center">
          {isUnseen ? (
            <div className="relative flex size-4 items-center justify-center rounded-full bg-vermillion-100">
              <div className="size-1.5 rounded-full bg-vermillion-900" />
            </div>
          ) : (
            <div className="size-4" />
          )}
          <img
            src={getServiceImage(order.serviceName)}
            alt={order.serviceName}
            className="size-16 shrink-0 rounded-lg object-cover"
          />
        </div>
        <div className="flex flex-1 items-center gap-3">
          <div className="flex-1">
            {isDraftOrder ? (
              <Body1 className="text-zinc-900">Book your next test</Body1>
            ) : (
              <Body1 className="flex items-center gap-2 text-zinc-900">
                <span>
                  {isUnseen ? 'View your' : ''} {order.serviceName} Action Plan
                </span>
                {isUnseen && (
                  <Label className="rounded bg-vermillion-100 px-[7px] pb-0.5 pt-[3px] text-xs text-vermillion-900">
                    New!
                  </Label>
                )}
              </Body1>
            )}
            <Body2 className="text-zinc-600">
              {isDraftOrder
                ? order.serviceName
                : order.date
                  ? moment(order.date).format('MMM D, YYYY')
                  : ''}
            </Body2>
          </div>
          <ChevronRight className="size-5 text-zinc-400 transition-all group-hover:-mr-1" />
        </div>
      </Link>
    );
  };

  // If only one actionable order, show it directly without collapse
  if (actionableOrders.length === 1) {
    return renderOrderItem(actionableOrders[0]);
  }

  // Multiple actionable orders - show with collapse
  return (
    <div className="rounded-[20px] border border-vermillion-900 bg-white shadow-[0_0_4px_0_rgba(252,95,43,0.5)]">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <button className="group relative flex w-full items-center gap-3 p-4 text-left">
            {unseenOrDrafts.length > 0 ? (
              <div className="relative flex size-4 items-center justify-center rounded-full bg-vermillion-100">
                <div className="size-1.5 rounded-full bg-vermillion-900" />
              </div>
            ) : (
              <div className="size-4" />
            )}
            <div className="flex flex-1 items-center justify-between">
              <Body1 className="text-zinc-900">
                {hasDrafts
                  ? `You have ${unseenOrDrafts.length} actionables`
                  : 'View your action plans'}
              </Body1>
              <ChevronDown
                className={cn(
                  'size-5 text-zinc-400 transition-transform duration-200',
                  !isOpen && '-rotate-90',
                )}
              />
            </div>
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="relative">
            <div className="absolute left-[46px] right-4 border-t border-zinc-200" />
            {actionableOrders.map((order, index) => {
              const isDraftOrder = order.status === OrderStatus.draft;
              const isUnseen = !order.lastViewed;
              const linkTo = getOrderLink(order);

              return (
                <Link
                  key={order.id}
                  to={linkTo}
                  className="group relative flex items-center px-4 py-2"
                >
                  <div className="flex shrink-0 items-center">
                    {isUnseen ? (
                      <div className="relative flex size-4 items-center justify-center rounded-full bg-vermillion-100">
                        <div className="size-1.5 rounded-full bg-vermillion-900" />
                      </div>
                    ) : (
                      <div className="size-4" />
                    )}
                    <img
                      src={getServiceImage(order.serviceName)}
                      alt={order.serviceName}
                      className="size-20 shrink-0 rounded-lg object-cover"
                    />
                  </div>
                  <div className="flex flex-1 items-center gap-3">
                    <div className="flex-1">
                      {isDraftOrder ? (
                        <Body1 className="text-zinc-900">
                          Book your next test
                        </Body1>
                      ) : (
                        <Body1 className="flex items-center gap-2 text-zinc-900">
                          <span>
                            {isUnseen ? 'View your' : ''} {order.serviceName}{' '}
                            Action Plan
                          </span>
                          {isUnseen && (
                            <Label className="rounded bg-vermillion-100 px-[7px] pb-0.5 pt-[3px] text-xs text-vermillion-900">
                              New!
                            </Label>
                          )}
                        </Body1>
                      )}
                      <Body2 className="text-zinc-600">
                        {isDraftOrder
                          ? order.serviceName
                          : order.date
                            ? moment(order.date).format('MMM D, YYYY')
                            : ''}
                      </Body2>
                    </div>
                    <ChevronRight className="size-5 text-zinc-400 transition-all group-hover:-mr-1" />
                  </div>
                  {index < actionableOrders.length - 1 && (
                    <div className="absolute bottom-0 left-[46px] right-4 border-b border-zinc-200" />
                  )}
                </Link>
              );
            })}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
