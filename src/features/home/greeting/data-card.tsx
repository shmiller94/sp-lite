import { motion } from 'framer-motion';

import { LockIcon } from '@/components/icons';
import { ArrowTopRight } from '@/components/icons/arrow-top-right-icon';
import NumberFlow from '@/components/shared/number-flow';
import { SuperpowerScoreLogo } from '@/components/shared/score-logo';
import { Button } from '@/components/ui/button';
import { H1, H4, Body2 } from '@/components/ui/typography';
import { useWindowDimensions } from '@/hooks/use-window-dimensions';
import { cn } from '@/lib/utils';

interface CardProps {
  dataState: 'loading' | 'loaded' | 'error';
  healthScoreData?: any;
  biologicalAge?: number | null;
  ageDifference?: number | null;
  cardType: 'superpower-score' | 'biological-age' | 'protocol';
  onClick?: () => void;
  animationDelay?: number;
}

export const DataCard = ({
  dataState,
  healthScoreData,
  biologicalAge,
  ageDifference,
  cardType,
  onClick,
  animationDelay = 1,
}: CardProps) => {
  const { width } = useWindowDimensions();
  const isMobile = width <= 768;

  const isClickable =
    (cardType !== 'protocol' &&
      cardType === 'superpower-score' &&
      healthScoreData?.value?.[0]?.quantity?.value) ||
    (cardType === 'biological-age' && biologicalAge);

  const cardVariants = {
    hidden: { y: isMobile ? 0 : 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        delay: animationDelay,
        duration: 1,
        ease: [0.16, 0.67, 0.43, 0.99],
      },
    },
  };

  const renderCard = () => {
    switch (cardType) {
      case 'superpower-score': {
        const hasData = healthScoreData?.value?.[0]?.quantity?.value;
        const score = hasData ? healthScoreData.value[0].quantity.value : null;

        return (
          <>
            <div className="flex w-full flex-1 justify-between gap-4">
              <SuperpowerScoreLogo />
              {hasData ? (
                <ArrowTopRight className="absolute right-5 top-5 text-white/50 transition-all duration-200 group-hover:right-4 group-hover:top-4 group-hover:text-white/75" />
              ) : (
                <LockIcon
                  fill="currentColor"
                  className="absolute right-5 top-5 w-5 text-white/50"
                />
              )}
            </div>
            <div className="flex w-full items-end justify-between gap-4">
              <div>
                {hasData ? (
                  <NumberFlow value={score} className="text-6xl text-white" />
                ) : (
                  <H1 className="text-white">--</H1>
                )}
                {hasData ? (
                  <Body2 className="text-white">Your health score</Body2>
                ) : (
                  <Body2 className="text-white">Awaiting lab results</Body2>
                )}
              </div>
              {hasData && (
                <div className="md:hidden">
                  <Button
                    type="button"
                    variant="white"
                    size="medium"
                    onClick={() => onClick?.()}
                    className="border border-primary/10"
                  >
                    More info
                  </Button>
                </div>
              )}
            </div>
          </>
        );
      }
      case 'biological-age': {
        const hasData = biologicalAge;
        return (
          <>
            <div className="flex w-full flex-1 justify-between gap-4">
              <H4 className="text-white">Biological Age</H4>
              {hasData ? (
                <ArrowTopRight className="absolute right-5 top-5 text-white/50 transition-all duration-200 group-hover:right-4 group-hover:top-4 group-hover:text-white/75" />
              ) : (
                <LockIcon
                  fill="currentColor"
                  className="absolute right-5 top-5 w-5 text-white/50"
                />
              )}
            </div>
            <div className="flex w-full items-end justify-between gap-4">
              <div>
                {hasData ? (
                  <NumberFlow
                    value={biologicalAge}
                    className="text-6xl text-white"
                  />
                ) : (
                  <H1 className="text-white">--</H1>
                )}
                {ageDifference ? (
                  <Body2 className="line-clamp-2 text-white">
                    {ageDifference} years younger than your chronological age
                  </Body2>
                ) : (
                  <Body2 className="text-white">Awaiting lab results</Body2>
                )}
              </div>
              {hasData && (
                <div className="md:hidden">
                  <Button
                    type="button"
                    variant="white"
                    size="medium"
                    onClick={() => onClick?.()}
                    className="border border-primary/10"
                  >
                    More info
                  </Button>
                </div>
              )}
            </div>
          </>
        );
      }
      case 'protocol':
        return (
          <>
            <div className="flex w-full justify-between gap-4">
              <H4 className="text-white">Your Protocol</H4>
              <LockIcon
                fill="currentColor"
                className="absolute right-5 top-5 w-5 text-white/50"
              />
            </div>
            <div className="flex h-full flex-col justify-between">
              <div className="relative h-full">
                <Body2 className="bg-gradient-to-b from-white/75 to-white/10 bg-clip-text text-transparent">
                  Based on your lab data you consider this daily protocol
                  following supplements, lifestyle choices, prescriptions and
                  diagnostic tests
                </Body2>
                <div className="absolute inset-0 z-20 mb-2 flex items-center justify-center">
                  <Body2 className="relative z-10 rounded-full border border-white/5 bg-white/25 px-4 py-2 text-white backdrop-blur-2xl">
                    <LockIcon
                      fill="currentColor"
                      className="mr-2 inline-block w-4"
                    />
                    Protocol coming soon
                  </Body2>
                </div>
              </div>
              <Body2 className="text-white">Awaiting lab results</Body2>
            </div>
          </>
        );
    }
  };

  return (
    <motion.div
      className={cn(
        'group flex h-56 w-full flex-col justify-between outline-transparent focus:outline-1 focus:outline-white/20 overflow-hidden rounded-2xl border border-white/10 bg-zinc-400/30 p-4 backdrop-blur-xl transition-colors duration-200 hover:border-white/20 hover:bg-zinc-400/40',
        isClickable && 'cursor-pointer',
      )}
      onClick={isClickable ? onClick : undefined}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onClick?.();
              }
            }
          : undefined
      }
      variants={cardVariants}
      initial="hidden"
      animate={dataState === 'loaded' ? 'visible' : 'hidden'}
    >
      <div className="flex h-full flex-col justify-start">{renderCard()}</div>
    </motion.div>
  );
};
