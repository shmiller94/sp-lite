import { m } from 'framer-motion';
import { useCallback, useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { H2, Body1, H4 } from '@/components/ui/typography';
import {
  WhyItMattersDialog,
  CitationsDialog,
} from '@/features/protocol/components/dialogs';
import { ProtocolIndexNumber } from '@/features/protocol/components/protocol-index-number';
import { ProtocolListingButton } from '@/features/protocol/components/protocol-listing-button';
import { useProtocolStepperContext } from '@/features/protocol/components/reveal/protocol-stepper-context';
import { getSymptomIcon } from '@/utils/symptom-to-icon-mapper';

import { ProtocolStepLayout } from '../../../layouts/protocol-step-layout';

import { BiomarkerCausesDialog } from './biomarker-causes-dialog';

interface GoalDetailStepProps {
  goalIndex: number;
}

export const GoalDetailStep = ({ goalIndex }: GoalDetailStepProps) => {
  const { next, getGoal, getGoalBiomarkers } = useProtocolStepperContext();
  const goal = getGoal(goalIndex);
  const resolvedBiomarkers = getGoalBiomarkers(goalIndex);

  const handleNext = useCallback(() => {
    next();
  }, [next]);

  // Get citations from all actions (primary + additional)
  const citations = useMemo(() => {
    const primary = goal?.primaryAction.citations ?? [];
    const additional = (goal?.additionalActions ?? []).flatMap(
      (a) => a.citations ?? [],
    );
    return [...primary, ...additional];
  }, [goal?.primaryAction.citations, goal?.additionalActions]);

  if (!goal) {
    return null;
  }

  return (
    <ProtocolStepLayout className="gap-6">
      <div className="flex items-start gap-4">
        <div className="relative shrink-0">
          <ProtocolIndexNumber
            index={goalIndex}
            className="text-5xl md:text-6xl"
          />
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <H2 className="md:text-2xl md:leading-tight">{goal.title}</H2>
          {goal.recoveryTime && (
            <Body1 className="text-sm text-secondary">
              {goal.recoveryTime}
            </Body1>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <H4 className="mb-0.5 text-lg">What we found</H4>
          <Body1 className="leading-relaxed text-secondary">
            {goal.description}
          </Body1>
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <H4 className="mb-0.5 text-lg">How you might be feeling</H4>
          <div className="flex flex-wrap gap-2">
            {goal.possibleSymptoms.map((symptom, index) => {
              const IconComponent = getSymptomIcon(symptom);
              return (
                <Body1
                  key={index}
                  as="span"
                  className="flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-2 text-sm text-secondary"
                >
                  <IconComponent className="size-4" />
                  {symptom}
                </Body1>
              );
            })}
          </div>
        </m.div>

        <div className="space-y-2">
          {goal.biomarkers.length > 0 && (
            <BiomarkerCausesDialog
              biomarkers={resolvedBiomarkers}
              observationCount={goal.biomarkers.length}
              isLoading={resolvedBiomarkers.length === 0}
            >
              <ProtocolListingButton delay={0.4}>
                <div>
                  <H4 className="text-base">What&apos;s causing this?</H4>
                  <Body1 className="text-sm text-secondary">
                    {resolvedBiomarkers.length > 0
                      ? `${resolvedBiomarkers.length} Key Biomarkers`
                      : `${goal.biomarkers.length} Key Biomarkers`}
                  </Body1>
                </div>
                <img
                  src="/protocol/goals/chart.webp"
                  alt="Biomarker chart"
                  className="h-20 w-32 object-contain"
                />
              </ProtocolListingButton>
            </BiomarkerCausesDialog>
          )}

          <WhyItMattersDialog
            goalTitle={goal.title}
            impactContent={goal.impactContent}
          >
            <ProtocolListingButton delay={0.6}>
              <div>
                <H4 className="text-base">Impact on you</H4>
                <Body1 className="text-sm text-secondary">
                  Why addressing this matters for your health
                </Body1>
              </div>
              <img
                src="/protocol/twins/twin-neutral.webp"
                alt="Impact visualization"
                className="my-4 size-16 object-cover"
                style={{
                  maskImage:
                    'linear-gradient(to bottom, black 75%, transparent 100%)',
                  WebkitMaskImage:
                    'linear-gradient(to bottom, black 75%, transparent 100%)',
                }}
              />
            </ProtocolListingButton>
          </WhyItMattersDialog>

          {citations.length > 0 && (
            <CitationsDialog citations={citations}>
              <ProtocolListingButton delay={0.8}>
                <div>
                  <H4 className="text-base">{citations.length} Citations</H4>
                </div>
                <img
                  src="/protocol/what-we-do/protocols.webp"
                  alt="Research protocols"
                  className="-mr-4 h-24 w-28 object-contain px-4 pt-2 rounded-mask"
                />
              </ProtocolListingButton>
            </CitationsDialog>
          )}
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <Button className="w-full" onClick={handleNext}>
          How to fix this?
        </Button>
      </div>
    </ProtocolStepLayout>
  );
};
