import { CarePlanActivity, Goal } from '@medplum/fhirtypes';
import React, { useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Body1, Body2, H3, H4 } from '@/components/ui/typography';
import { useMarketplace } from '@/features/marketplace/api/get-marketplace';
import { useProducts } from '@/features/supplements/api';
import { cn } from '@/lib/utils';
import { getPrescriptionImage } from '@/utils/prescription';

import {
  CARE_PLAN_ACTIVITY_BRIEF_EXTENSION,
  CARE_PLAN_ACTIVITY_TYPE_EXTENSION,
} from '../../const/extension-types';
import { useCarePlan } from '../../context/care-plan-context';
import { useBundle } from '../../hooks/use-bundle';
import { useCarePlanCart } from '../../stores/care-plan-cart-store';
import { normalizeRxCode } from '../../utils/normalize-rx-code';
import { ActivityCard } from '../activities/activity-card';
import { ProductCard } from '../activities/product-card';
import { ServiceCard } from '../activities/service-card';

type PlanGoalActivitiesProps = {
  goal: Goal;
};

export function PlanGoalActivities({ goal }: PlanGoalActivitiesProps) {
  const [, setSearchParams] = useSearchParams();
  const { addAllProducts, isProductSelected } = useCarePlanCart();
  const { plan } = useCarePlan();
  const activities = plan?.activity ?? [];
  const { data: productsData } = useProducts({});
  const { data: marketplaceData } = useMarketplace();

  const goalId = goal.id;

  const linkedActivities = activities.filter((activity) => {
    const refs = activity.detail?.goal?.map((g) => g.reference) ?? [];
    const isLinked = goalId
      ? refs.some((ref) => ref === `Goal/${goalId}`)
      : false;

    if (!isLinked) return false;

    return true;
  });

  const { products, total, totalSavings, name, description } = useBundle(
    linkedActivities as CarePlanActivity[],
  );

  const isAllBundleProductsSelected = useMemo(() => {
    if (!products || products.length === 0) return false;
    return products.every((p) => isProductSelected(p.id));
  }, [products, isProductSelected]);

  const handleAddBundle = useCallback(() => {
    if (!products || products.length === 0) return;
    addAllProducts(products);
    setSearchParams((params) => {
      params.set('modal', 'checkout');
      return params;
    });
  }, [products, addAllProducts, setSearchParams]);

  if (!linkedActivities.length) return null;
  const isBundle = linkedActivities.length > 1;

  return (
    <div className="space-y-2">
      <Body1>
        <strong>
          Recommended Product
          {isBundle ? 's' : ''}:
        </strong>
      </Body1>
      <div
        className={cn(
          isBundle &&
            'rounded-[22px] border border-zinc-200 bg-zinc-100 overflow-hidden',
        )}
      >
        {isBundle && (
          <div className="flex flex-col justify-between gap-4 p-4 px-6 lg:flex-row lg:items-center lg:gap-0">
            <div>
              <H4>{name}</H4>
              <Body1 className="text-secondary">{description}</Body1>
            </div>
            {products.length > 0 && (
              <div className="flex flex-row gap-2 lg:flex-row lg:items-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="order-last lg:order-first">
                      <Badge className="cursor-default bg-vermillion-900/10 text-sm text-vermillion-900">
                        Save ${totalSavings.toFixed(2)}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      Members get exclusive pricing
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <H3>${total.toFixed(2)}</H3>
              </div>
            )}
          </div>
        )}
        <div
          className={cn(
            isBundle &&
              '-ml-px w-[calc(100%+2px)] overflow-hidden rounded-t-3xl border-x border-t border-zinc-200 bg-white',
          )}
        >
          {linkedActivities.map((activity, index) => {
            const productCoding =
              activity.detail?.productCodeableConcept?.coding?.[0];
            const serviceCoding = activity.detail?.code?.coding?.[0];
            const activityType = activity.detail?.extension?.find(
              (ext) => ext.url === CARE_PLAN_ACTIVITY_TYPE_EXTENSION,
            )?.valueString;

            // Inline service/test card when referenced
            if (!productCoding && serviceCoding) {
              const serviceBrief = activity.detail?.extension?.find(
                (e) => e.url === CARE_PLAN_ACTIVITY_BRIEF_EXTENSION,
              )?.valueString;

              return (
                <>
                  <ServiceCard
                    key={`goal-${goalId}-service-${index}`}
                    serviceCoding={serviceCoding}
                    className={cn(isBundle && 'rounded-none border-none')}
                    buttonVariant={isBundle ? 'outline' : 'default'}
                    description={serviceBrief}
                  />
                  {isBundle &&
                    linkedActivities.indexOf(activity) !==
                      linkedActivities.length - 1 && (
                      <div className="w-full bg-white">
                        <hr className="mx-auto max-w-[calc(100%-2rem)]" />
                      </div>
                    )}
                </>
              );
            }

            if (!productCoding) return null;

            if (activityType === 'rx-experimental') {
              const rxCode = productCoding.code;
              const formattedRxCode = normalizeRxCode(rxCode);

              const prescription = marketplaceData?.prescriptions?.find(
                (item) => item.id === formattedRxCode,
              );

              // Early return if prescription data not available
              if (!prescription || !prescription.url || !prescription.price) {
                return null;
              }

              const rxImage = getPrescriptionImage(prescription.name);
              const rxPdpUrl = `/prescriptions/${formattedRxCode}`;
              const serviceBrief = activity.detail?.extension?.find(
                (e) => e.url === CARE_PLAN_ACTIVITY_BRIEF_EXTENSION,
              )?.valueString;

              return (
                <>
                  <ActivityCard
                    key={`goal-${goalId}-rx-${index}`}
                    name={prescription.name}
                    image={rxImage}
                    link={rxPdpUrl}
                    description={
                      serviceBrief ? (
                        <Body2 className="text-secondary">{serviceBrief}</Body2>
                      ) : (
                        <Body2 className="italic text-zinc-500">
                          Starting at ${prescription.price}
                        </Body2>
                      )
                    }
                    className={cn(isBundle && 'rounded-none border-none')}
                    actionBtn={
                      <Button
                        size="medium"
                        asChild
                        variant={isBundle ? 'outline' : 'default'}
                      >
                        <a
                          href={prescription.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Get Started
                        </a>
                      </Button>
                    }
                  />
                  {isBundle &&
                    linkedActivities.indexOf(activity) !==
                      linkedActivities.length - 1 && (
                      <div className="w-full bg-white">
                        <hr className="mx-auto max-w-[calc(100%-2rem)]" />
                      </div>
                    )}
                </>
              );
            }

            const product = productsData?.products?.find(
              (p) => p.id === productCoding.code,
            );
            const productName = productCoding.display || 'Product';
            const productBrief = activity.detail?.extension?.find(
              (e) => e.url === CARE_PLAN_ACTIVITY_BRIEF_EXTENSION,
            )?.valueString;

            return (
              <>
                <ProductCard
                  key={`goal-${goalId}-product-${index}`}
                  productName={productName}
                  product={product}
                  description={productBrief}
                  buttonVariant={isBundle ? 'outline' : 'default'}
                  className={cn(isBundle && 'rounded-none border-none')}
                />
                {isBundle &&
                  linkedActivities.indexOf(activity) !==
                    linkedActivities.length - 1 && (
                    <div className="w-full bg-white">
                      <hr className="mx-auto max-w-[calc(100%-2rem)]" />
                    </div>
                  )}
              </>
            );
          })}
          {isBundle && (
            <div className="w-full p-6">
              <Button
                className="w-full"
                size="medium"
                onClick={handleAddBundle}
                disabled={products.length === 0 || isAllBundleProductsSelected}
              >
                Add bundle
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
