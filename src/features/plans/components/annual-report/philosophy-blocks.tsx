import { ReactNode, useMemo } from 'react';

import { MiniScoreChart } from '@/components/ui/charts/mini-donut-chart/mini-donut-chart';
import { CategoryValue } from '@/components/ui/charts/types/categories';
import { Spinner } from '@/components/ui/spinner';
import { Body1, Body2, H4 } from '@/components/ui/typography';
import { Body4 } from '@/components/ui/typography/body4/body4';
import { useBiomarkerCategoriesWithUpsells } from '@/features/plans/hooks/use-biomarker-categories-with-upsells';
import { useLatestHealthScore } from '@/features/plans/hooks/use-latest-health-score';
import { cn } from '@/lib/utils';
import { BiomarkerComponent } from '@/types/api';

import { COMPONENT_DESCRIPTIONS } from './component-descriptions';

export const BlockGroupComponent = ({
  className,
  children,
  component,
}: {
  className?: string;
  children?: ReactNode;
  component: BiomarkerComponent;
}) => {
  const { title, value } = component;

  const { description, hasCustomDescription } = useMemo(() => {
    const componentDescription =
      COMPONENT_DESCRIPTIONS[title as keyof typeof COMPONENT_DESCRIPTIONS];
    if (
      componentDescription &&
      value in componentDescription &&
      componentDescription[value as keyof typeof componentDescription]
    ) {
      return {
        description:
          componentDescription[value as keyof typeof componentDescription],
        hasCustomDescription: true,
      };
    }

    let defaultDescription = '';
    switch (value) {
      case 'A':
        defaultDescription = 'good';
        break;
      case 'B':
        defaultDescription = 'normal';
        break;
      default:
        defaultDescription = 'out of range';
    }

    return {
      description: defaultDescription,
      hasCustomDescription: false,
    };
  }, [value, title]);

  if (value === '-') {
    return null;
  }

  return (
    <div className={cn('health-grade-card py-5', className)}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <MiniScoreChart value={component.value as CategoryValue} />
            <Body1>{component.title}</Body1>
          </div>
        </div>
        {hasCustomDescription ? (
          <Body2>{description}</Body2>
        ) : (
          <Body2>
            Your {title} is {description} based on our records.
          </Body2>
        )}
        {children}
      </div>
    </div>
  );
};

const BiomarkerBlocks = ({
  biomarkers,
  prefix,
}: {
  biomarkers: BiomarkerComponent[];
  prefix: string;
}) => {
  return biomarkers.map((bc, groupIndex) => (
    <BlockGroupComponent key={`${prefix}-${groupIndex}`} component={bc} />
  ));
};

export const PhilosophyBlocks = ({ className }: { className?: string }) => {
  const {
    latestScore,
    healthGrades,
    isLoading: isHealthScoreLoading,
  } = useLatestHealthScore();

  const {
    environmentalBiomarkers,
    nutritionBiomarkers,
    isLoading: biomarkerCategoriesLoading,
  } = useBiomarkerCategoriesWithUpsells(latestScore?.component ?? []);

  if (isHealthScoreLoading || biomarkerCategoriesLoading) {
    return (
      <div className="flex min-h-96 w-full items-center justify-center">
        <Spinner variant="primary" />
      </div>
    );
  }

  if (!latestScore) {
    return null;
  }

  return (
    <section className={cn('flex flex-col', className)}>
      <div className="mb-8 grid w-full flex-col gap-x-12 gap-y-1 md:grid-cols-2">
        <div className="mt-8 flex flex-col gap-2 md:col-span-2">
          <H4>Overview</H4>
          <Body1>
            We have processed 100+ biomarkers to provide you with this
            comprehensive report.
          </Body1>
        </div>
        <BiomarkerBlocks biomarkers={healthGrades} prefix="health" />
        <BiomarkerBlocks
          biomarkers={environmentalBiomarkers.validBiomarkers}
          prefix="environmental"
        />
        <BiomarkerBlocks
          biomarkers={nutritionBiomarkers.validBiomarkers}
          prefix="nutrition"
        />
        <div className="mb-8 space-y-1.5 md:col-span-2">
          <Body4 className="text-secondary">Disclaimer</Body4>
          <Body4 className="text-zinc-400">
            The scores generated under Health Optimization, Nutrition & Gut, and
            Lifestyle & Appearance are system-generated using unique data shared
            about your medical history and health background. This report is
            exclusively intended to be used for health optimization and wellness
            purposes. These scores are not intended to diagnose or treat
            disease, or to substitute a physicianʼs consultation. These insights
            are determined by evaluating current research and may change over
            time to reflect the most up to date research available.
          </Body4>
        </div>
      </div>
    </section>
  );
};
