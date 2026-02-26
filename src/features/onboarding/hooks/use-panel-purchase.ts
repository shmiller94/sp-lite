import { useCallback, useEffect, useMemo } from 'react';

import { toast } from '@/components/ui/sonner';
import { KIT_SERVICES } from '@/const/services';
import { useCreateCredit } from '@/features/orders/api/credits';
import { useServices } from '@/features/services/api';
import { usePaymentMethods } from '@/features/settings/api';
import { HealthcareService } from '@/types/api';

import { useOnboardingCartStore } from '../stores/onboarding-cart-store';

import { useOnboardingAnalytics } from './use-onboarding-analytics';

type PanelPurchaseMode = 'direct-purchase' | 'add-to-cart';

type UsePanelPurchaseOptions = {
  serviceName: string;
  mode?: PanelPurchaseMode;
  onSuccess?: () => void;
  onError?: () => void;
  /** Called when service is unavailable after loading completes */
  onUnavailable?: () => void;
};

type Pricing = {
  originalPrice: number;
  salePrice: number;
  discountPercent: number;
  totalPrice: number;
};

type UsePanelPurchaseReturn = {
  purchase: () => Promise<void>;
  isPending: boolean;
  service: HealthcareService | undefined;
  isLoading: boolean;
  isAvailable: boolean;
  pricing: Pricing;
};

export const usePanelPurchase = ({
  serviceName,
  mode = 'direct-purchase',
  onSuccess,
  onError,
  onUnavailable,
}: UsePanelPurchaseOptions): UsePanelPurchaseReturn => {
  const group = KIT_SERVICES.has(serviceName) ? 'test-kit' : 'phlebotomy';
  const servicesQuery = useServices({ group });
  const paymentMethodsQuery = usePaymentMethods();
  const createCreditMutation = useCreateCredit();
  const addPanel = useOnboardingCartStore((state) => state.addPanel);
  const { trackOnboardingCreditPurchase, trackOnboardingCreditAddedToCart } =
    useOnboardingAnalytics();

  const isDirectPurchase = mode === 'direct-purchase';
  const isLoading =
    servicesQuery.isLoading ||
    (isDirectPurchase && paymentMethodsQuery.isLoading);

  const service = useMemo(() => {
    const services = servicesQuery.data?.services ?? [];
    return services.find((s) => s.name === serviceName);
  }, [servicesQuery.data?.services, serviceName]);

  const isAvailable = !isLoading && !!service?.price;

  const pricing = useMemo(() => {
    const priceInCents = service?.price ?? 0;
    return {
      originalPrice: Math.round(priceInCents * 1.1),
      salePrice: priceInCents,
      discountPercent: 10,
      totalPrice: priceInCents,
    };
  }, [service?.price]);

  const firstPaymentMethod = useMemo(() => {
    const methods = paymentMethodsQuery.data?.paymentMethods ?? [];
    return methods[0];
  }, [paymentMethodsQuery.data?.paymentMethods]);

  const paymentMethodId = firstPaymentMethod?.externalPaymentMethodId;

  // Auto-skip when service is unavailable after loading completes
  useEffect(() => {
    if (!isLoading && !service?.price && onUnavailable) {
      onUnavailable();
    }
  }, [isLoading, service?.price, onUnavailable]);

  const purchase = useCallback(async () => {
    if (!service?.id) {
      toast.error('Service not available');
      onError?.();
      return;
    }

    if (mode === 'add-to-cart') {
      addPanel(service.id);
      trackOnboardingCreditAddedToCart({
        id: service.id,
        price: service.price ?? 0,
      });
      toast.success('Added to cart!');
      onSuccess?.();
      return;
    }

    if (!paymentMethodId) {
      toast.error('No payment method available');
      onError?.();
      return;
    }

    try {
      await createCreditMutation.mutateAsync({
        data: {
          serviceIds: [service.id],
          paymentMethodId,
        },
      });
    } catch (_error) {
      toast.error('Purchase failed. Please try again later.');
      onError?.();
      return;
    }

    trackOnboardingCreditPurchase({
      credits: [{ id: service.id, price: service.price ?? 0 }],
      totalValue: service.price ?? 0,
      paymentProvider: firstPaymentMethod?.paymentProvider ?? 'unknown',
    });
    toast.success('Purchase successful!');
    onSuccess?.();
  }, [
    mode,
    addPanel,
    service?.id,
    service?.price,
    paymentMethodId,
    firstPaymentMethod?.paymentProvider,
    createCreditMutation,
    trackOnboardingCreditPurchase,
    trackOnboardingCreditAddedToCart,
    onSuccess,
    onError,
  ]);

  return {
    purchase,
    isPending: isDirectPurchase ? createCreditMutation.isPending : false,
    service,
    isLoading,
    isAvailable,
    pricing,
  };
};
