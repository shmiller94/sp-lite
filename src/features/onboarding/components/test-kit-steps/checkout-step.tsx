// Animations removed for simplicity
import NumberFlow from '@number-flow/react';
import { CircleCheckBig } from 'lucide-react';
import { useCallback, useMemo } from 'react';

import { SplitScreenLayout } from '@/components/layouts/split-screen-layout';
import { TestimonialCarousel } from '@/components/shared/testimonials/components/testimonial-carousel';
import { Button } from '@/components/ui/button';
import { H3, H4 } from '@/components/ui/typography';
import { useTestKitServices } from '@/features/onboarding/hooks/use-test-kits';
import { useCreateCredit } from '@/features/orders/api/credits';
import { usePaymentMethodSelection } from '@/features/settings/hooks';
import * as Payment from '@/features/users/components/payment';
import { useUser } from '@/lib/auth';
import { cn } from '@/lib/utils';

import { useOnboardingAnalytics } from '../../hooks/use-onboarding-analytics';
import { useOnboardingStepper } from '../onboarding-steps/onboarding-stepper';
import { ItemPreviews } from '../shared/item-previews';
import { UpsellServiceCard } from '../shared/upsell-service-card';

const CheckoutStepContent = () => {
  const { services, selectedServices, selectService } = useTestKitServices();
  const { data: user } = useUser();
  const { trackOnboardingCreditPurchase } = useOnboardingAnalytics();
  const { next: nextOnboardingStep } = useOnboardingStepper();

  const { mutateAsync, isPending, error } = useCreateCredit();

  const {
    isFlexSelected,
    hasFlexPaymentMethod,
    activePaymentMethod,
    activePaymentMethodId,
    startSelectingPaymentMethod,
  } = usePaymentMethodSelection();

  const totalPrice = useMemo(() => {
    return selectedServices.reduce((acc, service) => acc + service.price, 0);
  }, [selectedServices]);

  const createCreditsFromServices = useCallback(async () => {
    if (!user) return;

    await mutateAsync({
      data: {
        serviceIds: selectedServices.map((s) => s.id),
        paymentMethodId: activePaymentMethod?.externalPaymentMethodId,
      },
    });

    const purchasedCredits = selectedServices.map((s) => ({
      id: s.id,
      price: s.price,
    }));
    const totalValue = purchasedCredits.reduce((sum, c) => sum + c.price, 0);
    trackOnboardingCreditPurchase({
      credits: purchasedCredits,
      totalValue,
    });

    return nextOnboardingStep();
  }, [
    user,
    selectedServices,
    mutateAsync,
    activePaymentMethod?.externalPaymentMethodId,
    nextOnboardingStep,
    trackOnboardingCreditPurchase,
  ]);

  const existingOrders = useMemo(() => {
    return services.some((service) => service.order);
  }, [services]);

  const handleBooking = async () => {
    if (!selectedServices?.length) {
      return nextOnboardingStep();
    }

    await createCreditsFromServices();
  };

  const buttonContent = useMemo(() => {
    if (isPending) return <>Confirming…</>;

    let text = '';
    if (selectedServices.length > 0) {
      text = `Book additional tests${isFlexSelected ? ' with HSA/FSA' : ''}`;
    } else if (existingOrders) {
      text = 'Confirm booking details';
    } else {
      text = 'Continue without additional tests';
    }

    return (
      <>
        {isFlexSelected && <CircleCheckBig className="mr-2 size-[20px]" />}
        {text}
      </>
    );
  }, [isPending, selectedServices.length, existingOrders, isFlexSelected]);

  const showPricingCta = selectedServices.length > 0;

  return (
    <>
      <div className="mx-auto mb-16 flex w-full flex-col space-y-4 px-6 lg:mt-0 lg:max-w-[700px] lg:pt-16">
        <div>
          <H3>Order Summary</H3>
        </div>
        <div className="space-y-2">
          {services.map((service) => {
            if (!service) return null;

            return (
              <UpsellServiceCard
                service={service}
                services={services}
                selectedServices={selectedServices}
                toggleService={selectService}
                key={service.id}
              />
            );
          })}
        </div>
        {selectedServices.length > 0 && (
          <div>
            <H3 className="mb-4">Payment</H3>

            <Payment.CurrentPaymentMethodCard
              className="bg-white"
              error={
                error
                  ? 'There was an issue with your payment method. Please try again'
                  : undefined
              }
            />
          </div>
        )}

        {/* Pricing + CTA wrapper with simple CSS transition */}
        <div className="w-full space-y-4">
          <div
            className={cn(
              'transition-all duration-300 ease-out overflow-hidden',
              showPricingCta
                ? ''
                : '-mt-4 max-h-0 pointer-events-none blur-[2px] opacity-0',
            )}
          >
            {totalPrice > 0 && (
              <div className="my-4 flex justify-between gap-4 py-4">
                <H4>Total</H4>
                <H4 className="text-right text-zinc-500">
                  <NumberFlow
                    className="text-lg"
                    prefix="$"
                    value={Number(totalPrice / 100)}
                  />
                </H4>
              </div>
            )}

            <div className="space-y-4 pb-4">
              <Button
                onClick={handleBooking}
                disabled={isPending}
                className="w-full hover:bg-zinc-800 disabled:bg-zinc-700 disabled:opacity-100"
              >
                {buttonContent}
              </Button>
              {hasFlexPaymentMethod &&
                selectedServices.length > 0 &&
                !activePaymentMethodId && (
                  <Button
                    onClick={startSelectingPaymentMethod}
                    variant="outline"
                    className="w-full bg-white"
                  >
                    <CircleCheckBig className="mr-2 size-[20px] text-zinc-700" />
                    Select HSA/FSA card
                  </Button>
                )}
            </div>
          </div>
          {!showPricingCta && (
            <div className="space-y-4 pb-4">
              <Button
                onClick={handleBooking}
                disabled={isPending}
                className="w-full hover:bg-zinc-800 disabled:bg-zinc-700 disabled:opacity-100"
              >
                {buttonContent}
              </Button>
            </div>
          )}
        </div>
        <div>
          <TestimonialCarousel darkMode={false} />
        </div>
        <div className="h-24 md:hidden" />
      </div>
      <ItemPreviews services={services} />
    </>
  );
};

export const CheckoutStep = () => (
  <SplitScreenLayout title="Checkout" className="bg-zinc-50">
    <CheckoutStepContent />
  </SplitScreenLayout>
);
