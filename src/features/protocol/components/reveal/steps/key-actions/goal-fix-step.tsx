import { IconAnalytics } from '@central-icons-react/round-filled-radius-2-stroke-1.5/IconAnalytics';
import { IconExclamationCircle } from '@central-icons-react/round-filled-radius-2-stroke-1.5/IconExclamationCircle';
import { IconSparkle } from '@central-icons-react/round-filled-radius-2-stroke-1.5/IconSparkle';
import { m } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useCallback, useMemo } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { H2, H4 } from '@/components/ui/typography';
import { CommitActionButton } from '@/features/protocol/components/commit-action-button';
import {
  CitationsDialog,
  AdditionalContentDialog,
} from '@/features/protocol/components/dialogs';
import { ProtocolMarkdown } from '@/features/protocol/components/protocol-markdown';
import { useProtocolStepperContext } from '@/features/protocol/components/reveal/protocol-stepper-context';
import {
  ACTION_TYPE_FALLBACK_IMAGE,
  getActionTypeImage,
} from '@/features/protocol/const/protocol-constants';
import { useSupplementProductLookup } from '@/features/protocol/hooks/use-supplement-product-lookup';
import { useRevealBuilderStore } from '@/features/protocol/stores/reveal-builder-store';

import { ProtocolStepLayout } from '../../../layouts/protocol-step-layout';

interface GoalFixStepProps {
  goalIndex: number;
}

export const GoalFixStep = ({ goalIndex }: GoalFixStepProps) => {
  const { next, getGoal } = useProtocolStepperContext();
  const getSupplementProduct = useSupplementProductLookup();
  const { committedActions } = useRevealBuilderStore();
  const goal = getGoal(goalIndex);
  const isPrimaryActionAdded = goal
    ? goal.primaryAction.id in committedActions
    : false;

  const handleNext = useCallback(() => {
    next();
  }, [next]);

  // Get citations from the primary action (must be before early return)
  const citations = useMemo(() => {
    return goal?.primaryAction.citations ?? [];
  }, [goal?.primaryAction.citations]);

  if (!goal) {
    return null;
  }

  const { primaryAction } = goal;
  const actionTitle =
    goal.titleCopyVariations?.keyActionTitle ?? `How to fix ${goal.title}`;
  const actionImage = getActionTypeImage(primaryAction.content);

  const lookOutForContent =
    primaryAction.content.type === 'supplement'
      ? primaryAction.content.lookOutFor
      : null;
  const supplementProduct =
    primaryAction.content.type === 'supplement'
      ? getSupplementProduct(primaryAction.content.productId)
      : null;

  return (
    <ProtocolStepLayout className="w-full items-start gap-4">
      <div className="space-y-2">
        <Badge variant="secondary" className="gap-2 bg-zinc-100 pr-4">
          <IconSparkle className="size-4 text-vermillion-900" />
          <span className="text-sm text-secondary">Key Action</span>
        </Badge>
        <H2 className="mb-4 text-2xl">{actionTitle}</H2>
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

      <div className="w-full space-y-6">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full space-y-6 rounded-2xl border border-zinc-200 bg-white p-4"
        >
          {primaryAction.additionalContent ? (
            <AdditionalContentDialog
              actionTitle={primaryAction.title}
              additionalContent={primaryAction.additionalContent}
              supplementProduct={supplementProduct}
            >
              <div
                role="button"
                tabIndex={0}
                className="-m-2 w-full cursor-pointer space-y-6 rounded-xl p-2 text-left transition-colors hover:bg-zinc-50 active:scale-[0.99]"
              >
                <div className="mb-4 flex w-full items-center justify-between">
                  <H4 className="text-base">{primaryAction.title}</H4>
                  <span className="flex items-center gap-1 rounded-full border border-zinc-200 px-2 py-1 text-xs text-secondary">
                    Details
                    <ChevronRight className="size-3" />
                  </span>
                </div>

                <div className="media-organic-reveal mb-4 flex justify-center">
                  <img
                    src={actionImage}
                    alt={primaryAction.title}
                    className="h-56 w-full object-cover rounded-mask"
                    onError={(e) => {
                      e.currentTarget.src = ACTION_TYPE_FALLBACK_IMAGE;
                    }}
                  />
                </div>

                <m.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="rounded-2xl"
                >
                  {/* note(Kingsley): This is sligthly bugged on the BE, let's fix this when we're done redesigning */}
                  {/* <div className="mb-3 flex items-center gap-2">
                      <div className="flex size-5 items-center justify-center rounded-full bg-vermillion-900/20">
                        <IconCircleQuestionmark className="size-4 text-vermillion-900" />
                      </div>
                      <H4 className="text-base">Why we recommend this?</H4>
                    </div> */}

                  <ProtocolMarkdown
                    content={primaryAction.description}
                    className="text-sm text-secondary [&>div]:mb-0"
                  />
                </m.div>

                {lookOutForContent && (
                  <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="rounded-2xl"
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <div className="flex size-5 items-center justify-center rounded-full bg-vermillion-900/20">
                        <IconExclamationCircle className="size-4 text-vermillion-900" />
                      </div>
                      <H4 className="text-base">What to look out for?</H4>
                    </div>

                    <ProtocolMarkdown
                      content={lookOutForContent}
                      className="text-sm text-secondary [&>div]:mb-0"
                    />
                  </m.div>
                )}
              </div>
            </AdditionalContentDialog>
          ) : (
            <>
              <div className="mb-4">
                <H4 className="text-base">{primaryAction.title}</H4>
              </div>

              <div className="media-organic-reveal mb-4 flex justify-center">
                <img
                  src={actionImage}
                  alt={primaryAction.title}
                  className="h-56 w-full object-cover rounded-mask"
                  onError={(e) => {
                    e.currentTarget.src = ACTION_TYPE_FALLBACK_IMAGE;
                  }}
                />
              </div>

              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="rounded-2xl"
              >
                {/* note(Kingsley): This is sligthly bugged on the BE, let's fix this when we're done redesigning */}
                {/* <div className="mb-3 flex items-center gap-2">
                  <div className="flex size-5 items-center justify-center rounded-full bg-vermillion-900/20">
                    <IconCircleQuestionmark className="size-4 text-vermillion-900" />
                  </div>
                  <H4 className="text-base">Why we recommend this?</H4>
                </div> */}

                <ProtocolMarkdown
                  content={primaryAction.description}
                  className="text-sm text-secondary [&>div]:mb-0"
                />
              </m.div>

              {lookOutForContent && (
                <m.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="rounded-2xl"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex size-5 items-center justify-center rounded-full bg-vermillion-900/20">
                      <IconExclamationCircle className="size-4 text-vermillion-900" />
                    </div>
                    <H4 className="text-base">What to look out for?</H4>
                  </div>

                  <ProtocolMarkdown
                    content={lookOutForContent}
                    className="text-sm text-secondary [&>div]:mb-0"
                  />
                </m.div>
              )}
            </>
          )}

          {citations.length > 0 && (
            <CitationsDialog citations={citations}>
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
            <CommitActionButton action={primaryAction} goalId={goal.id} />
          </div>
        </m.div>
      </div>

      <Button className="w-full" onClick={handleNext}>
        {isPrimaryActionAdded ? 'Continue' : 'Skip'}
      </Button>
    </ProtocolStepLayout>
  );
};
