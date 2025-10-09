import moment from 'moment';
import React, { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/sonner';
import { TextShimmer } from '@/components/ui/text-shimmer';
import { Body1, Body2, H2 } from '@/components/ui/typography';
import { useCreateOrder, useUpdateOrder } from '@/features/orders/api';
import { HealthcareServiceFooter } from '@/features/orders/components/healthcare-service-footer';
import { OrderAppointmentDetails } from '@/features/orders/components/order-appointment-details';
import { HEALTHCARE_SERVICE_DIALOG_CONTAINER_STYLE } from '@/features/orders/const/config';
import { useHasCredit } from '@/features/orders/hooks';
import { useOrder } from '@/features/orders/stores/order-store';
import { useService } from '@/features/services/api';
import { usePaymentMethods } from '@/features/settings/api';
import { CreatePaymentMethodForm } from '@/features/settings/components/billing/create-payment-method-form';
import { CurrentPaymentMethodCard } from '@/features/users/components/current-payment-method-card';
import { useStepper } from '@/lib/stepper';
import { cn } from '@/lib/utils';
import { formatMoney } from '@/utils/format-money';
import { getServiceImage } from '@/utils/service';

export function OrderSummary(): ReactNode {
  const {
    service,
    location,
    slot,
    collectionMethod,
    tz,
    addOnIds,
    buildCreateOrderData,
    buildUpdateOrderData,
    onSuccess,
  } = useOrder((s) => s);
  const { nextStep, prevStep } = useStepper((s) => s);

  const paymentMethodsQuery = usePaymentMethods();
  const serviceQuery = useService({
    serviceId: service.id,
    addOnServiceIds: addOnIds.size > 0 ? [...addOnIds] : undefined,
    method: collectionMethod,
  });
  const { isCreditLoading, credit } = useHasCredit({
    serviceName: service.name,
  });

  const createOrderMutation = useCreateOrder({
    mutationConfig: {
      onSuccess: () => {
        onSuccess?.();
      },
    },
  });
  const updateOrderMutation = useUpdateOrder({
    mutationConfig: {
      onSuccess: () => {
        onSuccess?.();
      },
    },
  });

  const isMutationLoading =
    createOrderMutation.isPending || updateOrderMutation.isPending;

  const isQueryLoading =
    serviceQuery.isLoading || isCreditLoading || paymentMethodsQuery.isLoading;

  const price = serviceQuery.data?.service.price;
  const defaultPaymentMethod = paymentMethodsQuery.data?.paymentMethods.find(
    (pm) => pm.default,
  );

  const createOrderFn = async (): Promise<void> => {
    if (service === null)
      throw Error('There was a problem creating the order.');

    const response = await createOrderMutation.mutateAsync({
      data: buildCreateOrderData(),
    });

    if (response.order) {
      nextStep();
    }
  };

  const updateOrderFn = async (): Promise<void> => {
    if (!credit) {
      toast('No orderId found for previous order. Contact support.');
      return;
    }

    await updateOrderMutation.mutateAsync({
      orderId: credit.id,
      data: buildUpdateOrderData(),
    });

    nextStep();
  };

  return (
    <>
      <div
        className={cn('space-y-8', HEALTHCARE_SERVICE_DIALOG_CONTAINER_STYLE)}
      >
        <div className="space-y-1">
          <H2>Order Summary</H2>
          {process.env.NODE_ENV === 'development' ? (
            <Body2 className="text-pink-700">
              DEBUG (not visible in prod):&nbsp;
              {credit
                ? `using existing draft order ${credit.id}`
                : 'creating new order, no existing credit found'}
            </Body2>
          ) : null}
          <Body1 className="text-secondary">
            Confirm your order details below.
          </Body1>
        </div>
        {isQueryLoading ? (
          <>
            <Skeleton className="h-12 w-full rounded-2xl" />
            <Skeleton className="h-[130px] w-full rounded-2xl" />
          </>
        ) : null}
        {defaultPaymentMethod && !isQueryLoading ? (
          <div className="space-y-6 md:space-y-10">
            <CreateOrderSummaryItem price={price} />
            <OrderAppointmentDetails
              collectionMethod={collectionMethod ?? undefined}
              slot={slot ?? undefined}
              timezone={tz ?? moment.tz.guess()}
              location={location ?? undefined}
              isPhlebotomy={service.phlebotomy}
              serviceName={service.name}
              supportsLabOrder={service.supportsLabOrder}
              selectedPanels={[...addOnIds, ...(credit?.addOnServiceIds ?? [])]}
            />
            {price && price > 0 ? <CurrentPaymentMethodCard /> : null}
          </div>
        ) : null}
        {!defaultPaymentMethod && !isQueryLoading ? (
          <div className="space-y-4">
            <H2>We do not have your payment method!</H2>
            <CreatePaymentMethodForm />
          </div>
        ) : null}
      </div>
      <HealthcareServiceFooter
        prevBtn={
          <Button
            variant="outline"
            className="w-full bg-white"
            onClick={prevStep}
            disabled={isMutationLoading}
          >
            Back
          </Button>
        }
        nextBtn={
          <Button
            onClick={credit ? updateOrderFn : createOrderFn}
            className="w-full"
            disabled={
              isMutationLoading ||
              price === undefined ||
              isQueryLoading ||
              !defaultPaymentMethod
            }
          >
            {isMutationLoading ? (
              <TextShimmer
                className="line-clamp-1 text-base [--base-color:white] [--base-gradient-color:#a1a1aa]"
                duration={1}
              >
                Confirming…
              </TextShimmer>
            ) : (
              'Confirm'
            )}
          </Button>
        }
      />
    </>
  );
}

function CreateOrderSummaryItem({
  price,
  isLoading = false,
}: {
  price?: number;
  isLoading?: boolean;
}): ReactNode {
  const { service } = useOrder((s) => s);
  return (
    <div className="flex items-center justify-between gap-2 rounded-[20px] border border-zinc-200 bg-white px-5 py-3 shadow shadow-black/[.03] sm:flex-row">
      <div className="flex items-center gap-3">
        <img
          src={getServiceImage(service.name)}
          alt={service.name}
          className="size-16 rounded-xl object-cover object-center"
        />
        <div className="space-y-0.5">
          <Body1>{service.name}</Body1>
          <Body2 className="line-clamp-3 text-zinc-400">
            {service.description}
          </Body2>
        </div>
      </div>
      {isLoading ? <Skeleton className="h-6 w-full" /> : null}
      {price && price > 0 ? <Body1>{formatMoney(price)}</Body1> : null}
    </div>
  );
}
