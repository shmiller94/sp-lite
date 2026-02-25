import { IconAnalytics } from '@central-icons-react/round-filled-radius-2-stroke-1.5/IconAnalytics';
import { IconSparkle } from '@central-icons-react/round-filled-radius-2-stroke-1.5/IconSparkle';
import { ChevronRight } from 'lucide-react';
import { useCallback } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { H2, H4, Body1 } from '@/components/ui/typography';
import { CommitActionButton } from '@/features/protocol/components/commit-action-button';
import {
  CitationsDialog,
  AdditionalContentDialog,
} from '@/features/protocol/components/dialogs';
import { useProtocolStepperContext } from '@/features/protocol/components/reveal/protocol-stepper-context';
import { getActionTypeImage } from '@/features/protocol/const/protocol-constants';
import { useSupplementProductLookup } from '@/features/protocol/hooks/use-supplement-product-lookup';
import { useRevealBuilderStore } from '@/features/protocol/stores/reveal-builder-store';

import { ProtocolStepLayout } from '../../../layouts/protocol-step-layout';
import { ProtocolMarkdown } from '../../../protocol-markdown';

interface GoalRecommendationsStepProps {
  goalIndex: number;
}

export const GoalRecommendationsStep = ({
  goalIndex,
}: GoalRecommendationsStepProps) => {
  const { next, getGoal } = useProtocolStepperContext();
  const getSupplementProduct = useSupplementProductLookup();
  const { committedActions } = useRevealBuilderStore();
  const goal = getGoal(goalIndex);
  const hasAnyActionAdded = goal
    ? Object.values(committedActions).some((a) => a.goalId === goal.id)
    : false;

  const handleNext = useCallback(() => {
    next();
  }, [next]);

  if (!goal) {
    return null;
  }

  const additionalActions = goal.additionalActions ?? [];
  const sectionTitle =
    goal.titleCopyVariations?.additionalActionTitle ??
    `More ways to support your ${goal.title.toLowerCase()}`;

  // Skip this step if there are no additional actions
  if (additionalActions.length === 0) {
    return (
      <ProtocolStepLayout className="w-full items-start gap-4">
        <div className="text-center">
          <H2 className="mb-4 text-2xl">No additional recommendations</H2>
          <Body1 className="text-secondary">
            The key action is all you need for this goal.
          </Body1>
        </div>
        <Button className="w-full" onClick={handleNext}>
          Next Goal
        </Button>
      </ProtocolStepLayout>
    );
  }

  return (
    <ProtocolStepLayout className="w-full items-start gap-4">
      <div className="space-y-2">
        <Badge variant="secondary" className="gap-2 bg-zinc-100 pr-4">
          <IconSparkle className="size-4 text-vermillion-900" />
          <span className="text-sm text-secondary">Additional Actions</span>
        </Badge>
        <H2 className="mb-4 text-2xl">{sectionTitle}</H2>
        {/* <div className="mb-6 flex items-center gap-3">
          <img
            src={REVIEWING_CLINICIAN.avatarUrl}
            alt={REVIEWING_CLINICIAN.name}
            className="size-6 rounded-full border border-black/10"
          />
          <span className="text-sm text-secondary">
            Approved by {REVIEWING_CLINICIAN.name}
          </span>
        </div> */}
      </div>

      <div className="w-full space-y-4">
        {additionalActions.map((action) => {
          const actionImage = getActionTypeImage(action.content);
          const supplementProduct =
            action.content.type === 'supplement'
              ? getSupplementProduct(action.content.productId)
              : null;
          return (
            <div
              key={action.id}
              className="w-full rounded-2xl border border-zinc-200 bg-white p-4"
            >
              {action.additionalContent ? (
                <AdditionalContentDialog
                  actionTitle={action.title}
                  additionalContent={action.additionalContent}
                  supplementProduct={supplementProduct}
                >
                  <div
                    role="button"
                    tabIndex={0}
                    className="-m-2 mb-4 w-full cursor-pointer rounded-xl p-2 text-left transition-colors hover:bg-zinc-50 active:scale-[0.99]"
                  >
                    <div className="mb-4 flex w-full items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={actionImage}
                          alt={action.title}
                          className="size-12 rounded-lg object-cover"
                        />
                        <H4 className="text-lg">{action.title}</H4>
                      </div>
                      <span className="flex shrink-0 items-center gap-1 rounded-full border border-zinc-200 px-2 py-1 text-xs text-secondary">
                        Details
                        <ChevronRight className="size-3" />
                      </span>
                    </div>

                    <ProtocolMarkdown
                      content={action.description}
                      className="text-sm text-secondary [&>div]:mb-0"
                    />
                  </div>
                </AdditionalContentDialog>
              ) : (
                <>
                  <div className="mb-4 flex items-center gap-2">
                    <img
                      src={actionImage}
                      alt={action.title}
                      className="size-12 rounded-lg object-cover"
                    />
                    <H4 className="text-lg">{action.title}</H4>
                  </div>

                  <div className="mb-4">
                    <ProtocolMarkdown
                      content={action.description}
                      className="text-sm text-secondary [&>div]:mb-0"
                    />
                  </div>
                </>
              )}

              {(action.citations ?? []).length > 0 && (
                <CitationsDialog citations={action.citations!}>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 rounded-full border border-zinc-200 px-2 py-1 text-sm text-secondary transition-colors hover:bg-zinc-50"
                  >
                    <IconAnalytics className="size-4" />
                    <span>Clinical Evidence</span>
                    <ChevronRight className="size-4" />
                  </button>
                </CitationsDialog>
              )}

              <div className="flex w-full justify-end">
                <CommitActionButton action={action} goalId={goal.id} />
              </div>
            </div>
          );
        })}
      </div>

      <Button className="w-full" onClick={handleNext}>
        {hasAnyActionAdded ? 'Next Goal' : 'Skip'}
      </Button>
    </ProtocolStepLayout>
  );
};
