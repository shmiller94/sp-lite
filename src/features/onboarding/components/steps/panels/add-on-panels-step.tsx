import { ChevronLeft, Plus, Search, X } from 'lucide-react';
import { useCallback, useMemo, useRef, useState } from 'react';

import { Head } from '@/components/seo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/sonner';
import { Spinner } from '@/components/ui/spinner/spinner';
import { Body1, Body2, H2, H3 } from '@/components/ui/typography';
import {
  ADVANCED_BLOOD_PANEL,
  SUPERPOWER_BLOOD_PANEL,
  TOTAL_TOXIN_TEST_ID,
} from '@/const/services';
import { useCreateCredit, useCredits } from '@/features/orders/api/credits';
import { useServices } from '@/features/services/api';
import { usePaymentMethodSelection } from '@/features/settings/hooks';
import { CurrentPaymentMethodCard } from '@/features/users/components/payment';
import { cn } from '@/lib/utils';
import { HealthcareService } from '@/types/api';
import { formatMoney } from '@/utils/format-money';
import { getServiceImage } from '@/utils/service';

import { useOnboardingAnalytics } from '../../../hooks/use-onboarding-analytics';
import { useOnboardingNavigation } from '../../../hooks/use-onboarding-navigation';
import { useOnboardingCartStore } from '../../../stores/onboarding-cart-store';
import { Sequence } from '../../sequence';

const FILTER_OPTIONS = [
  { id: 'all', label: 'All tests' },
  { id: 'metabolic', label: 'Metabolic' },
  { id: 'heart', label: 'Heart health' },
  { id: 'hormones', label: 'Hormones' },
] as const;

type FilterId = (typeof FILTER_OPTIONS)[number]['id'];

const FILTER_KEYWORDS: Record<FilterId, string[]> = {
  all: [],
  metabolic: [
    'metabolic',
    'glucose',
    'insulin',
    'diabetes',
    'energy',
    'weight',
  ],
  heart: ['heart', 'cardio', 'cardiovascular', 'cholesterol', 'lipid'],
  hormones: ['hormone', 'fertility', 'reproductive', 'testosterone', 'thyroid'],
};

const ExploreTestsSearch = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search"
        className="h-11 rounded-full border-none bg-zinc-100 pl-11 pr-10 font-normal text-primary shadow-none outline-none placeholder:text-zinc-400 focus-visible:ring-1 focus-visible:ring-zinc-100"
      />
      {value.trim().length > 0 && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-zinc-400 hover:text-primary"
          aria-label="Clear search"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
};

const FilterPills = ({
  activeFilter,
  onFilterChange,
}: {
  activeFilter: FilterId;
  onFilterChange: (filter: FilterId) => void;
}) => (
  <div className="flex flex-nowrap gap-2 overflow-x-auto pb-1">
    {FILTER_OPTIONS.map((option) => {
      const isActive = activeFilter === option.id;
      return (
        <Button
          key={option.id}
          type="button"
          size="small"
          variant={isActive ? 'default' : 'outline'}
          className={cn(
            'shrink-0 whitespace-nowrap rounded-full border shadow-none',
            isActive ? 'border-primary' : 'border-zinc-200 text-secondary',
          )}
          onClick={() => onFilterChange(option.id)}
        >
          {option.label}
        </Button>
      );
    })}
  </div>
);

const TestCard = ({
  service,
  isSelected,
  onToggle,
  disabled,
}: {
  service: HealthcareService;
  isSelected: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) => (
  <button
    type="button"
    onClick={onToggle}
    disabled={disabled}
    aria-pressed={isSelected}
    aria-label={isSelected ? 'Remove from cart' : 'Add to cart'}
    className={cn(
      'flex w-full cursor-pointer items-start gap-4 py-4 text-left',
      disabled && 'cursor-not-allowed opacity-50',
    )}
  >
    <div className="flex-1 space-y-1">
      <Body1 className="font-medium text-zinc-900">{service.name}</Body1>
      <Body2 className="text-zinc-500">{service.description}</Body2>
      <Body1 className="text-zinc-900">{formatMoney(service.price)}</Body1>
    </div>
    <div className="relative shrink-0 pr-1">
      <img
        src={getServiceImage(service.name)}
        alt={service.name}
        className="size-20 rounded-lg object-contain"
      />
      <div
        className={cn(
          'absolute -bottom-1 right-0 flex size-8 items-center justify-center rounded-full border shadow-md transition-colors',
          isSelected
            ? 'border-zinc-800 bg-zinc-950 text-white'
            : 'border-white bg-white text-zinc-900 hover:bg-zinc-50',
        )}
      >
        {isSelected ? (
          <span className="text-sm font-medium">✓</span>
        ) : (
          <Plus className="size-5" />
        )}
      </div>
    </div>
  </button>
);

const TestCardSkeleton = () => (
  <div className="flex items-start gap-4 py-4">
    <div className="flex-1 space-y-2">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-5 w-16" />
    </div>
    <Skeleton className="size-20 shrink-0 rounded-lg" />
  </div>
);

export const AddOnPanelsStep = () => {
  const { next, prev } = useOnboardingNavigation();
  const { trackOnboardingCreditPurchase } = useOnboardingAnalytics();
  const { selectedPanelIds, togglePanel, clear } = useOnboardingCartStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterId>('all');

  const { activePaymentMethod, isFlexSelected, isSelectingPaymentMethod } =
    usePaymentMethodSelection();
  const creditsQuery = useCredits();
  const phlebotomyServicesQuery = useServices({ group: 'phlebotomy' });
  const testKitServicesQuery = useServices({ group: 'test-kit' });
  const createCreditMutation = useCreateCredit();

  const existingCreditIds = useMemo(() => {
    const credits = creditsQuery.data?.credits ?? [];
    return new Set(credits.map((c) => c.serviceId));
  }, [creditsQuery.data?.credits]);

  const services = useMemo(() => {
    const rawServices = [
      ...(phlebotomyServicesQuery.data?.services ?? []),
      ...(testKitServicesQuery.data?.services ?? []),
    ];

    const filteredServices = rawServices.filter(
      (service) =>
        service.id !== TOTAL_TOXIN_TEST_ID &&
        service.name !== ADVANCED_BLOOD_PANEL &&
        service.name !== SUPERPOWER_BLOOD_PANEL,
    );

    const orderedServices = filteredServices.sort((a, b) => {
      const rank = (group?: string) => {
        if (group === 'phlebotomy') return 0;
        if (group === 'test-kit') return 1;
        return 2;
      };

      const rankDiff = rank(a.group) - rank(b.group);
      if (rankDiff !== 0) return rankDiff;

      return a.name.localeCompare(b.name);
    });

    return orderedServices.filter((s) => !existingCreditIds.has(s.id));
  }, [
    phlebotomyServicesQuery.data?.services,
    testKitServicesQuery.data?.services,
    existingCreditIds,
  ]);

  const filteredServices = useMemo(() => {
    let result = services;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.description?.toLowerCase().includes(query),
      );
    }

    if (activeFilter !== 'all') {
      const keywords = FILTER_KEYWORDS[activeFilter];
      result = result.filter((s) => {
        const text = `${s.name} ${s.description ?? ''}`.toLowerCase();
        return keywords.some((keyword) => text.includes(keyword));
      });
    }

    return result;
  }, [services, searchQuery, activeFilter]);

  const visibleSelectedServices = useMemo(() => {
    const nextSelectedServices: HealthcareService[] = [];
    for (const service of filteredServices) {
      if (selectedPanelIds.has(service.id)) {
        nextSelectedServices.push(service);
      }
    }
    return nextSelectedServices;
  }, [filteredServices, selectedPanelIds]);

  const visibleUnselectedServices = useMemo(() => {
    const nextUnselectedServices: HealthcareService[] = [];
    for (const service of filteredServices) {
      if (!selectedPanelIds.has(service.id)) {
        nextUnselectedServices.push(service);
      }
    }
    return nextUnselectedServices;
  }, [filteredServices, selectedPanelIds]);

  const selectedServices = useMemo(() => {
    const nextSelectedServices: HealthcareService[] = [];
    for (const service of services) {
      if (selectedPanelIds.has(service.id)) {
        nextSelectedServices.push(service);
      }
    }
    return nextSelectedServices;
  }, [services, selectedPanelIds]);

  const selectedServiceIds = useMemo(() => {
    const serviceIds: string[] = [];
    for (const service of selectedServices) {
      serviceIds.push(service.id);
    }
    return serviceIds;
  }, [selectedServices]);

  const totalPrice = useMemo(() => {
    let sum = 0;
    for (const service of selectedServices) {
      sum += service.price;
    }
    return sum;
  }, [selectedServices]);
  const hasSelectedServices = selectedServiceIds.length > 0;

  const handleToggle = useCallback(
    (service: HealthcareService) => {
      togglePanel(service.id);
    },
    [togglePanel],
  );

  const handleContinue = async () => {
    if (!hasSelectedServices) {
      if (selectedPanelIds.size > 0) {
        clear();
      }
      next();
      return;
    }

    const paymentMethodId = activePaymentMethod?.externalPaymentMethodId;
    if (paymentMethodId == null) {
      toast.error('No payment method available');
      return;
    }

    const paymentProvider = activePaymentMethod?.paymentProvider ?? 'unknown';

    try {
      await createCreditMutation.mutateAsync({
        data: {
          serviceIds: selectedServiceIds,
          paymentMethodId,
        },
      });

      const purchasedCredits: { id: string; price: number }[] = [];
      for (const service of selectedServices) {
        purchasedCredits.push({
          id: service.id,
          price: service.price,
        });
      }

      trackOnboardingCreditPurchase({
        credits: purchasedCredits,
        totalValue: totalPrice,
        paymentProvider,
      });

      toast.success('Purchase successful');
      clear();
      next();
    } catch {
      next();
    }
  };

  const handleSkip = () => {
    clear();
    next();
  };

  const isLoading =
    phlebotomyServicesQuery.isLoading ||
    testKitServicesQuery.isLoading ||
    creditsQuery.isLoading;
  const isPending = createCreditMutation.isPending;

  return (
    <>
      <Head title="Explore Tests" />
      <Sequence.StepLayout className="min-h-screen bg-white">
        <Sequence.StepHeader className="flex items-center justify-between border-b border-zinc-100 px-4 py-3">
          <button
            type="button"
            onClick={prev}
            className="flex items-center gap-1 text-zinc-500"
            aria-label="Go back"
          >
            <ChevronLeft className="size-5" />
            <span className="text-sm">Back</span>
          </button>
          <span className="text-sm font-medium text-zinc-900">Marketplace</span>
          <div className="w-14" />
        </Sequence.StepHeader>

        <div className="flex flex-1 flex-col overflow-hidden">
          <div
            className={cn(
              'flex-1 overflow-y-auto overflow-x-visible px-4',
              hasSelectedServices ? 'pb-[24rem]' : 'pb-40',
            )}
          >
            <div className="mx-auto max-w-lg py-6">
              <div className="sticky top-0 z-10 -mx-4 bg-white px-4 pb-4">
                <div className="space-y-6 pt-0.5">
                  <H2>Finalize your testing plan</H2>

                  <ExploreTestsSearch
                    value={searchQuery}
                    onChange={setSearchQuery}
                  />

                  <FilterPills
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                  />
                </div>
              </div>

              <div className="pt-2">
                <div className="divide-y divide-zinc-100 overflow-x-visible">
                  {isLoading &&
                    Array.from({ length: 5 }).map((_, i) => (
                      <TestCardSkeleton key={i} />
                    ))}

                  {!isLoading &&
                    visibleSelectedServices.length === 0 &&
                    visibleUnselectedServices.length === 0 && (
                      <div className="py-8 text-center">
                        <Body1 className="text-zinc-500">
                          No tests found matching your search.
                        </Body1>
                      </div>
                    )}

                  {!isLoading && visibleSelectedServices.length > 0 && (
                    <div className="pb-2 pt-1">
                      <H3 className="text-lg text-zinc-400">Selected tests</H3>
                    </div>
                  )}

                  {!isLoading &&
                    visibleSelectedServices.map((service) => (
                      <TestCard
                        key={service.id}
                        service={service}
                        isSelected
                        onToggle={() => handleToggle(service)}
                        disabled={isPending}
                      />
                    ))}

                  {!isLoading && visibleUnselectedServices.length > 0 && (
                    <div className="pb-2 pt-4">
                      <H3 className="text-lg text-zinc-400">
                        Explore other tests
                      </H3>
                    </div>
                  )}

                  {!isLoading &&
                    visibleUnselectedServices.map((service) => (
                      <TestCard
                        key={service.id}
                        service={service}
                        isSelected={false}
                        onToggle={() => handleToggle(service)}
                        disabled={isPending}
                      />
                    ))}
                </div>
              </div>
            </div>
          </div>

          <div className="fixed inset-x-0 bottom-0 border-t border-zinc-100 bg-white px-4 pb-8 pt-4">
            <div className="mx-auto max-w-lg space-y-3">
              {hasSelectedServices && <CurrentPaymentMethodCard />}
              <Button
                onClick={hasSelectedServices ? handleContinue : handleSkip}
                disabled={
                  isPending ||
                  isSelectingPaymentMethod ||
                  (hasSelectedServices &&
                    activePaymentMethod?.externalPaymentMethodId == null)
                }
                className="w-full"
              >
                {isPending && hasSelectedServices ? (
                  <span className="flex items-center justify-center gap-2">
                    <Spinner size="sm" variant="light" />
                    <span>Processing purchase</span>
                  </span>
                ) : (
                  <>
                    {hasSelectedServices
                      ? `Purchase selected tests${isFlexSelected ? ' with HSA/FSA' : ''}`
                      : 'Skip additional testing'}
                    {hasSelectedServices && (
                      <span className="ml-2 opacity-80">
                        {formatMoney(totalPrice)}
                      </span>
                    )}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </Sequence.StepLayout>
    </>
  );
};
