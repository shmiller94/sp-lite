import { IconAnalytics } from '@central-icons-react/round-filled-radius-2-stroke-1.5/IconAnalytics';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { Link } from '@tanstack/react-router';
import { m } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  useMemo,
  useRef,
  useState,
  useLayoutEffect,
  useCallback,
  type SyntheticEvent,
} from 'react';

import { Button } from '@/components/ui/button';
import { Body1, Body2, H2, H4 } from '@/components/ui/typography';
import { useBiomarkers } from '@/features/data/api';
import { AiSuggestions } from '@/features/messages/components/ai-suggestions';
import { useSupplementProductLookup } from '@/features/protocol/hooks/use-supplement-product-lookup';
import { Biomarker } from '@/types/api';
import { getSymptomIcon } from '@/utils/symptom-to-icon-mapper';

import type { ProtocolAction, ProtocolGoal } from '../../api';
import {
  ACTION_TYPE_FALLBACK_IMAGE,
  getActionTypeImage,
} from '../../const/protocol-constants';
import {
  AdditionalContentDialog,
  CitationsDialog,
  WhyItMattersDialog,
} from '../dialogs';
import { ProtocolIndexNumber } from '../protocol-index-number';
import { ProtocolMarkdown } from '../protocol-markdown';
import { BiomarkerCausesDialog } from '../reveal/steps/key-actions/biomarker-causes-dialog';

interface GoalDetailPageProps {
  goal: ProtocolGoal;
  goalIndex: number;
  protocolId: string;
  backLink: string;
}

export const GoalDetailPage = ({
  goal,
  goalIndex,
  protocolId: _protocolId,
  backLink,
}: GoalDetailPageProps) => {
  // Fetch biomarkers data
  const { data: allBiomarkers } = useBiomarkers();

  // Build an index mapping observation IDs to their parent biomarkers
  const observationBiomarkerIndex = useMemo(() => {
    const index = new Map<string, Biomarker>();
    if (!allBiomarkers?.biomarkers) return index;
    for (const biomarker of allBiomarkers.biomarkers) {
      for (const result of biomarker.value ?? []) {
        if (result.id) {
          index.set(result.id.toString(), biomarker);
        }
      }
    }
    return index;
  }, [allBiomarkers]);

  // Resolve biomarkers from FHIR references (e.g., "Observation/uuid" -> biomarker)
  const resolvedBiomarkers = useMemo(() => {
    if (!goal.biomarkers || observationBiomarkerIndex.size === 0) return [];

    const resolvedList: Biomarker[] = [];
    const seenBiomarkerIds = new Set<string>();

    for (const reference of goal.biomarkers) {
      // Extract observation ID from FHIR reference (e.g., "Observation/uuid" -> "uuid")
      const observationId = reference.replace(/^Observation\//, '');
      const biomarker = observationBiomarkerIndex.get(observationId);

      // Deduplicate - multiple observations may belong to the same biomarker
      if (biomarker && !seenBiomarkerIds.has(biomarker.id)) {
        seenBiomarkerIds.add(biomarker.id);
        resolvedList.push(biomarker);
      }
    }

    return resolvedList;
  }, [goal.biomarkers, observationBiomarkerIndex]);

  // Get citations from all actions (primary + additional)
  const citations = useMemo(() => {
    const primary = goal.primaryAction?.citations ?? [];
    const additional = (goal.additionalActions ?? []).flatMap(
      (a) => a.citations ?? [],
    );
    return [...primary, ...additional];
  }, [goal.primaryAction?.citations, goal.additionalActions]);

  const { primaryAction } = goal;
  const additionalActions = goal.additionalActions ?? [];

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 px-4 py-6 lg:px-0">
      {/* Back button */}
      <Link
        to={backLink}
        className="group inline-flex items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-zinc-700"
      >
        <ChevronLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
        <span>Back</span>
      </Link>

      {/* Header */}
      <div className="flex items-start gap-4">
        <ProtocolIndexNumber
          index={goalIndex}
          className="shrink-0 text-4xl md:text-5xl"
        />
        <div className="min-w-0 flex-1">
          <H2 className="text-xl md:text-2xl">{goal.title}</H2>
          {goal.recoveryTime && (
            <Body2 className="mt-1 text-secondary">{goal.recoveryTime}</Body2>
          )}
        </div>
      </div>

      {/* Tabs */}
      <TabsPrimitive.Root defaultValue="findings">
        <UnderlineTabs>
          <TabsPrimitive.Trigger
            value="findings"
            className="relative pb-3 text-sm font-medium text-zinc-500 transition-colors data-[state=active]:text-zinc-900 hover:text-zinc-700"
          >
            Findings
          </TabsPrimitive.Trigger>
          <TabsPrimitive.Trigger
            value="actions"
            className="relative pb-3 text-sm font-medium text-zinc-500 transition-colors data-[state=active]:text-zinc-900 hover:text-zinc-700"
          >
            Actions
          </TabsPrimitive.Trigger>
        </UnderlineTabs>

        <TabsPrimitive.Content value="findings" className="mt-6">
          <FindingsTab
            goal={goal}
            resolvedBiomarkers={resolvedBiomarkers}
            citations={citations}
          />
        </TabsPrimitive.Content>

        <TabsPrimitive.Content value="actions" className="mt-6">
          <ActionsTab
            goal={goal}
            primaryAction={primaryAction}
            additionalActions={additionalActions}
          />
        </TabsPrimitive.Content>
      </TabsPrimitive.Root>

      {/* Ask Superpower AI */}
      <div className="space-y-4 pt-4">
        <H4>Ask Superpower AI</H4>
        <AiSuggestions
          context={`I'm looking at my protocol goal: "${goal.title}". ${goal.description || ''} Please give me relevant questions I can ask about this goal.`}
        />
      </div>
    </div>
  );
};

// Underline Tabs Component with orange indicator
const UnderlineTabs = ({ children }: { children: React.ReactNode }) => {
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0 });
  const tabsRef = useRef<HTMLDivElement>(null);

  const updateIndicator = useCallback(() => {
    if (!tabsRef.current) return;
    const activeTab = tabsRef.current.querySelector(
      '[data-state="active"]',
    ) as HTMLElement;
    if (activeTab) {
      setIndicatorStyle({
        width: activeTab.offsetWidth,
        left: activeTab.offsetLeft,
      });
    }
  }, []);

  useLayoutEffect(() => {
    updateIndicator();

    if (!tabsRef.current) return;

    const observer = new MutationObserver((mutations) => {
      const hasStateChange = mutations.some(
        (m) => m.type === 'attributes' && m.attributeName === 'data-state',
      );
      if (hasStateChange) updateIndicator();
    });

    observer.observe(tabsRef.current, {
      attributes: true,
      attributeFilter: ['data-state'],
      subtree: true,
    });

    return () => observer.disconnect();
  }, [updateIndicator]);

  return (
    <TabsPrimitive.List
      ref={tabsRef}
      className="relative flex gap-6 border-b border-zinc-200"
    >
      {children}
      <div
        className="absolute bottom-0 h-0.5 bg-vermillion-900 transition-all duration-200 ease-out"
        style={{
          width: `${indicatorStyle.width}px`,
          left: `${indicatorStyle.left}px`,
        }}
      />
    </TabsPrimitive.List>
  );
};

// Findings Tab Component
interface FindingsTabProps {
  goal: ProtocolGoal;
  resolvedBiomarkers: Biomarker[];
  citations: NonNullable<ProtocolAction['citations']>;
}

const FindingsTab = ({
  goal,
  resolvedBiomarkers,
  citations,
}: FindingsTabProps) => {
  return (
    <div className="space-y-6">
      {/* How you might be feeling */}
      {goal.possibleSymptoms && goal.possibleSymptoms.length > 0 && (
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <H4 className="mb-3 text-base">How you might be feeling</H4>
          <div className="flex flex-wrap gap-2">
            {goal.possibleSymptoms.map((symptom, index) => {
              const IconComponent = getSymptomIcon(symptom);
              return (
                <span
                  key={index}
                  className="flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-2 text-sm text-secondary"
                >
                  <IconComponent className="size-4" />
                  {symptom}
                </span>
              );
            })}
          </div>
        </m.div>
      )}

      {/* What we found */}
      {goal.description && (
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <H4 className="mb-2 text-base">What we found</H4>
          <ProtocolMarkdown
            content={goal.description}
            className="text-sm leading-relaxed text-secondary"
          />
        </m.div>
      )}

      {/* Biomarkers and Impact cards */}
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
      >
        {goal.biomarkers && goal.biomarkers.length > 0 && (
          <BiomarkerCausesDialog
            biomarkers={resolvedBiomarkers}
            observationCount={goal.biomarkers.length}
            isLoading={resolvedBiomarkers.length === 0}
          >
            <button
              type="button"
              className="group flex w-full flex-col rounded-2xl border border-zinc-200 bg-white p-4 text-left shadow shadow-black/[.03] transition-colors hover:border-zinc-300"
            >
              <div className="mb-2 flex w-full items-start justify-between">
                <div>
                  <H4 className="text-base">What&apos;s causing this?</H4>
                  <Body2 className="text-secondary">
                    {resolvedBiomarkers.length > 0
                      ? `${resolvedBiomarkers.length} Key Biomarkers`
                      : `${goal.biomarkers.length} Key Biomarkers`}
                  </Body2>
                </div>
                <ChevronRight className="size-5 shrink-0 text-zinc-400 transition-all group-hover:translate-x-0.5 group-hover:text-zinc-500" />
              </div>
              <img
                src="/protocol/goals/chart.webp"
                alt="Biomarker chart"
                className="mt-auto h-20 w-full object-contain object-center"
              />
            </button>
          </BiomarkerCausesDialog>
        )}

        {goal.impactContent && (
          <WhyItMattersDialog
            goalTitle={goal.title}
            impactContent={goal.impactContent}
          >
            <button
              type="button"
              className="group flex w-full flex-col rounded-2xl border border-zinc-200 bg-white p-4 text-left shadow shadow-black/[.03] transition-colors hover:border-zinc-300"
            >
              <div className="mb-2 flex w-full items-start justify-between">
                <div>
                  <H4 className="text-base">Why this matters?</H4>
                  <Body2 className="text-secondary">Impact on you</Body2>
                </div>
                <ChevronRight className="size-5 shrink-0 text-zinc-400 transition-all group-hover:translate-x-0.5 group-hover:text-zinc-500" />
              </div>
              <img
                src="/protocol/twins/twin-neutral.webp"
                alt="Impact visualization"
                className="mt-auto h-28 self-center object-cover"
                style={{
                  maskImage:
                    'linear-gradient(to bottom, black 75%, transparent 100%)',
                  WebkitMaskImage:
                    'linear-gradient(to bottom, black 75%, transparent 100%)',
                }}
              />
            </button>
          </WhyItMattersDialog>
        )}
      </m.div>

      {/* Citations */}
      {citations.length > 0 && (
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <CitationsDialog citations={citations}>
            <button
              type="button"
              className="group flex w-full items-center justify-between rounded-2xl border border-zinc-200 bg-white p-4 text-left shadow shadow-black/[.03] transition-colors hover:border-zinc-300"
            >
              <H4 className="text-base">{citations.length} Citations</H4>
              <div className="flex items-center gap-3">
                <img
                  src="/protocol/what-we-do/protocols.webp"
                  alt="Research protocols"
                  className="h-12 w-32 object-contain rounded-mask"
                />
                <ChevronRight className="size-5 shrink-0 text-zinc-400 transition-all group-hover:translate-x-0.5 group-hover:text-zinc-500" />
              </div>
            </button>
          </CitationsDialog>
        </m.div>
      )}
    </div>
  );
};

// Actions Tab Component
interface ActionsTabProps {
  goal: ProtocolGoal;
  primaryAction: ProtocolAction;
  additionalActions: ProtocolAction[];
}

const ActionsTab = ({
  goal: _goal,
  primaryAction,
  additionalActions,
}: ActionsTabProps) => {
  const getSupplementProduct = useSupplementProductLookup();

  const stopPropagation = useCallback((event: SyntheticEvent) => {
    event.stopPropagation();
  }, []);

  const renderBuyNowButton = (
    productPurchaseUrl: string | undefined,
    contentType: ProtocolAction['content']['type'],
  ) => {
    const href =
      contentType === 'testing' ? '/marketplace' : productPurchaseUrl;
    if (href == null) return null;
    return (
      <Button
        asChild
        variant="outline"
        size="small"
        className="ml-auto h-8 px-3 text-xs"
        onClick={stopPropagation}
        onPointerDown={stopPropagation}
      >
        <a href={href} target="_blank" rel="noopener noreferrer">
          Buy now
        </a>
      </Button>
    );
  };

  const renderEvidenceButton = (
    actionCitations: NonNullable<ProtocolAction['citations']>,
  ) => {
    if (actionCitations.length === 0) return null;
    return (
      <CitationsDialog citations={actionCitations}>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-full border border-zinc-200 px-2 py-1 text-sm text-secondary transition-colors hover:bg-zinc-50"
          onClick={stopPropagation}
          onPointerDown={stopPropagation}
        >
          <IconAnalytics className="size-4" />
          <span>Clinical Evidence</span>
          <ChevronRight className="size-4" />
        </button>
      </CitationsDialog>
    );
  };

  const renderCardFooter = (
    actionCitations: NonNullable<ProtocolAction['citations']>,
    productPurchaseUrl: string | undefined,
    contentType: ProtocolAction['content']['type'],
  ) => {
    const showBuyNow = productPurchaseUrl != null || contentType === 'testing';
    if (actionCitations.length === 0 && !showBuyNow) return null;
    return (
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {renderEvidenceButton(actionCitations)}
        {renderBuyNowButton(productPurchaseUrl, contentType)}
      </div>
    );
  };

  if (!primaryAction) {
    return (
      <div className="py-8 text-center">
        <Body1 className="text-secondary">
          No actions available for this goal.
        </Body1>
      </div>
    );
  }

  const actionImage = getActionTypeImage(primaryAction.content);

  // Extract why and lookOutFor from supplement content type
  const whyContent =
    primaryAction.content.type === 'supplement'
      ? primaryAction.content.why
      : primaryAction.description;
  const lookOutForContent =
    primaryAction.content.type === 'supplement'
      ? primaryAction.content.lookOutFor
      : null;
  const primaryActionProduct =
    primaryAction.content.type === 'supplement'
      ? getSupplementProduct(primaryAction.content.productId)
      : null;
  const primaryActionProductPurchaseUrl = primaryActionProduct?.url;
  const primaryActionCitations = primaryAction.citations ?? [];

  const keyActionCard = (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm ${
        primaryAction.additionalContent ? 'cursor-pointer' : ''
      }`}
      role={primaryAction.additionalContent ? 'button' : undefined}
      tabIndex={primaryAction.additionalContent ? 0 : undefined}
    >
      <div className="mb-3 flex items-center gap-3">
        <img
          src={actionImage}
          alt={primaryAction.title}
          className="size-10 rounded-lg object-cover"
          onError={(e) => {
            e.currentTarget.src = ACTION_TYPE_FALLBACK_IMAGE;
          }}
        />
        <H4 className="flex-1 text-base">{primaryAction.title}</H4>
        {primaryAction.additionalContent && (
          <ChevronRight className="size-4 text-secondary" />
        )}
      </div>

      {whyContent && (
        <div className="space-y-1 pt-3">
          <ProtocolMarkdown
            content={whyContent}
            className="text-sm text-secondary [&>div]:mb-0"
          />
        </div>
      )}

      {lookOutForContent && (
        <div className="mt-3 space-y-1 pt-3">
          <ProtocolMarkdown
            content={lookOutForContent}
            className="text-sm text-secondary [&>div]:mb-0"
          />
        </div>
      )}

      {primaryActionCitations.length > 0 ||
      primaryActionProductPurchaseUrl != null ||
      primaryAction.content.type === 'testing' ? (
        <div
          role="presentation"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {renderCardFooter(
            primaryActionCitations,
            primaryActionProductPurchaseUrl ?? undefined,
            primaryAction.content.type,
          )}
        </div>
      ) : null}
    </m.div>
  );

  return (
    <div className="space-y-6">
      {/* Key Action */}
      <div>
        <H4 className="mb-3 text-base">Key Action</H4>

        {primaryAction.additionalContent ? (
          <AdditionalContentDialog
            actionTitle={primaryAction.title}
            additionalContent={primaryAction.additionalContent}
            supplementProduct={primaryActionProduct}
          >
            {keyActionCard}
          </AdditionalContentDialog>
        ) : (
          keyActionCard
        )}
      </div>

      {/* Additional Actions */}
      {additionalActions.length > 0 && (
        <div>
          <H4 className="mb-3 text-base">Additional Actions</H4>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {additionalActions.map((action, index) => {
              const actionImg = getActionTypeImage(action.content);
              const actionProduct =
                action.content.type === 'supplement'
                  ? getSupplementProduct(action.content.productId)
                  : null;
              const actionProductPurchaseUrl = actionProduct?.url;
              const actionCitations = action.citations ?? [];

              const cardBody = (
                <>
                  <div className="flex items-center gap-3">
                    <img
                      src={actionImg}
                      alt={action.title}
                      className="size-10 rounded-lg object-cover rounded-mask"
                      onError={(e) => {
                        e.currentTarget.src = ACTION_TYPE_FALLBACK_IMAGE;
                      }}
                    />
                    <div className="flex-1">
                      <H4 className="text-sm">{action.title}</H4>
                    </div>
                    {action.additionalContent && (
                      <ChevronRight className="size-4 text-secondary" />
                    )}
                  </div>

                  {action.description && (
                    <ProtocolMarkdown
                      content={action.description}
                      className="mt-2 text-xs text-secondary [&>div]:mb-0"
                    />
                  )}

                  {renderCardFooter(
                    actionCitations,
                    actionProductPurchaseUrl ?? undefined,
                    action.content.type,
                  )}
                </>
              );

              const cardProps = {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.4, delay: index * 0.1 },
                className: `rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm ${
                  action.additionalContent ? 'cursor-pointer' : ''
                }`,
                role: action.additionalContent ? 'button' : undefined,
                tabIndex: action.additionalContent ? 0 : undefined,
              };

              if (action.additionalContent) {
                return (
                  <AdditionalContentDialog
                    key={action.id || index}
                    actionTitle={action.title}
                    additionalContent={action.additionalContent}
                    supplementProduct={actionProduct}
                  >
                    <m.div {...cardProps}>{cardBody}</m.div>
                  </AdditionalContentDialog>
                );
              }

              return (
                <m.div key={action.id || index} {...cardProps}>
                  {cardBody}
                </m.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
