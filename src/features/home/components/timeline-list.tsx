import { motion, AnimatePresence } from 'framer-motion';
import React, { useState } from 'react';

import { ChevronUpIcon } from '@/components/icons/chevron-up-icon';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Timeline,
  TimelineLabel,
  TimelineEmptyCard,
  TimelineItem,
  TimelineHeader,
  TimelineDot,
  TimelineConnector,
} from '@/components/ui/timeline';
import { useTimeline } from '@/features/home/api/get-timeline';
import { useOrders } from '@/features/orders/api';
import { useServices } from '@/features/services/api';
import { cn } from '@/lib/utils';

import {
  ActionPlanTimelineItem,
  OrderTimelineItem,
  OnboardingTimelineItem,
} from './timeline-items';

const timelineItemVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
};

const accordionContentVariants = {
  hidden: {
    height: 0,
    opacity: 0,
    transition: {
      height: { duration: 0.2 },
      opacity: { duration: 0.1 },
    },
  },
  visible: {
    height: 'auto',
    opacity: 1,
    transition: {
      height: { duration: 0.2 },
      opacity: { duration: 0.1 },
    },
  },
};

export const TimelineList = () => {
  /**
   * We initially call these queries here to "preload" them for UI
   */
  const timelineQuery = useTimeline();
  const servicesQuery = useServices();
  const ordersQuery = useOrders();

  const timelineItems = timelineQuery.data;

  // State for accordion sections
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(true);
  const [isCurrentItemsOpen, setIsCurrentItemsOpen] = useState(true);
  const [isCompletedItemsOpen, setIsCompletedItemsOpen] = useState(true);

  if (
    servicesQuery.isLoading ||
    ordersQuery.isLoading ||
    timelineQuery.isLoading
  ) {
    return (
      <div className="w-full space-y-3">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <Skeleton className="h-[90px] w-full rounded-3xl" key={i} />
          ))}
      </div>
    );
  }

  if (!timelineItems) {
    return null;
  }

  const onboardingItems = timelineItems.filter(
    (ti) => ti.type === 'ONBOARDING_TASK' && ti.status !== 'DONE',
  );

  const currentItems = timelineItems.filter(
    (ti) =>
      ti.type !== 'ONBOARDING_TASK' &&
      ti.status !== 'DONE' &&
      ti.status !== 'DISABLED',
  );

  const completedItems = timelineItems.filter(
    (ti) => ti.status === 'DONE' || ti.status === 'DISABLED',
  );

  return (
    <div className="w-full">
      <Timeline className="w-full">
        {onboardingItems.length ? (
          <motion.div variants={timelineItemVariants}>
            <button
              onClick={() => setIsOnboardingOpen(!isOnboardingOpen)}
              className="mb-2 flex w-full items-center justify-between gap-8 py-2 pr-8 transition-opacity hover:opacity-75 md:mt-6"
            >
              <TimelineLabel>
                <span className="text-left text-balance">
                  Finish onboarding to get the most out of Superpower
                </span>
              </TimelineLabel>
              <ChevronUpIcon
                className={cn(
                  'size-4 text-zinc-400 transition-transform duration-200 shrink-0',
                  isOnboardingOpen && 'rotate-180',
                )}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOnboardingOpen && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={accordionContentVariants}
                >
                  {onboardingItems.map((t, i) => {
                    switch (t.type) {
                      case 'ONBOARDING_TASK':
                        return (
                          <motion.div
                            key={t.id}
                            variants={timelineItemVariants}
                          >
                            <OnboardingTimelineItem
                              key={t.id}
                              timelineItem={t}
                              shouldRenderConnector={
                                i !== onboardingItems.length - 1
                              }
                              shouldRenderNextConnector={false}
                            />
                          </motion.div>
                        );
                      default:
                        return null;
                    }
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : null}

        {(currentItems.length > 0 || completedItems.length > 0) && (
          <div
            id="mobile-separator"
            className={cn(
              'mx-auto mt-2 transition-all duration-200 w-px rounded-full bg-gradient-to-b from-transparent via-zinc-100 to-vermillion-900 md:hidden',
              isCurrentItemsOpen && 'h-8',
              !isCurrentItemsOpen && 'h-0',
            )}
          />
        )}

        {currentItems.length ? (
          <motion.div
            variants={timelineItemVariants}
            className={cn(
              'transition-all duration-200 mb-6',
              isCurrentItemsOpen && 'my-6',
              !isCurrentItemsOpen && 'my-0',
              isOnboardingOpen && 'mt-6',
              !isOnboardingOpen && 'mt-0',
            )}
          >
            <button
              onClick={() => setIsCurrentItemsOpen(!isCurrentItemsOpen)}
              className="flex w-full items-center justify-between gap-8 pr-8 transition-opacity hover:opacity-75"
            >
              <TimelineLabel className="mb-2 py-2">
                <span className="text-left text-balance">Next steps</span>
              </TimelineLabel>
              <ChevronUpIcon
                className={cn(
                  'size-4 text-zinc-400 transition-transform duration-200 shrink-0',
                  isCurrentItemsOpen && 'rotate-180',
                )}
              />
            </button>
            <AnimatePresence initial={false}>
              {isCurrentItemsOpen && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={accordionContentVariants}
                >
                  <motion.div variants={timelineItemVariants}>
                    <TimelineItem>
                      <TimelineConnector />
                      <TimelineHeader>
                        <TimelineDot className="hidden md:block" />
                        <TimelineEmptyCard />
                      </TimelineHeader>
                    </TimelineItem>
                  </motion.div>
                  {currentItems.map((t, i) => {
                    switch (t.type) {
                      case 'ORDER':
                        return (
                          <motion.div
                            key={t.id}
                            variants={timelineItemVariants}
                          >
                            <OrderTimelineItem
                              timelineItem={t}
                              key={t.id}
                              shouldRenderConnector={
                                i !== currentItems.length - 1
                              }
                              shouldRenderNextConnector={false}
                            />
                          </motion.div>
                        );
                      case 'PLAN':
                        return (
                          <motion.div
                            key={t.id}
                            variants={timelineItemVariants}
                          >
                            <ActionPlanTimelineItem
                              key={t.id}
                              shouldRenderConnector={
                                i !== currentItems.length - 1
                              }
                              shouldRenderNextConnector={false}
                              timelineItem={t}
                            />
                          </motion.div>
                        );
                      default:
                        return null;
                    }
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : null}

        {completedItems.length > 0 && (
          <div
            id="mobile-separator"
            className={cn(
              'mx-auto mt-2 transition-all duration-200 w-px rounded-full bg-gradient-to-b from-transparent via-zinc-100 to-vermillion-900 md:hidden',
              isCompletedItemsOpen && 'h-8',
              !isCompletedItemsOpen && 'h-0',
            )}
          />
        )}

        {completedItems.length ? (
          <motion.div variants={timelineItemVariants}>
            <button
              onClick={() => setIsCompletedItemsOpen(!isCompletedItemsOpen)}
              className="flex w-full items-center justify-between gap-8 pr-8 transition-opacity hover:opacity-75"
            >
              <TimelineLabel className="mb-2 py-2">
                <span className="text-left text-balance">Done</span>
              </TimelineLabel>
              <ChevronUpIcon
                className={cn(
                  'size-4 text-zinc-400 transition-transform duration-200 shrink-0',
                  isCompletedItemsOpen && 'rotate-180',
                )}
              />
            </button>
            <AnimatePresence initial={false}>
              {isCompletedItemsOpen && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={accordionContentVariants}
                >
                  {completedItems.map((t, i) => {
                    switch (t.type) {
                      case 'ORDER':
                        return (
                          <motion.div
                            key={t.id}
                            variants={timelineItemVariants}
                          >
                            <OrderTimelineItem
                              timelineItem={t}
                              key={t.id}
                              shouldRenderConnector={
                                i !== completedItems.length - 1
                              }
                              shouldRenderNextConnector={false}
                            />
                          </motion.div>
                        );
                      case 'ONBOARDING_TASK':
                        return (
                          <motion.div
                            key={t.id}
                            variants={timelineItemVariants}
                          >
                            <OnboardingTimelineItem
                              key={t.id}
                              timelineItem={t}
                              shouldRenderConnector={
                                i !== completedItems.length - 1
                              }
                              shouldRenderNextConnector={false}
                            />
                          </motion.div>
                        );
                      case 'PLAN':
                        return (
                          <motion.div
                            key={t.id}
                            variants={timelineItemVariants}
                          >
                            <ActionPlanTimelineItem
                              key={t.id}
                              timelineItem={t}
                              shouldRenderConnector={
                                i !== completedItems.length - 1
                              }
                              shouldRenderNextConnector={false}
                            />
                          </motion.div>
                        );
                    }
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : null}
      </Timeline>
    </div>
  );
};
