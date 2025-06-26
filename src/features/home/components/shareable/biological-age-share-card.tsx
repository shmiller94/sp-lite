import { motion } from 'framer-motion';
import { useState } from 'react';

import { ChevronLeft } from '@/components/icons/chevron-left-icon';
import { HoverableCard } from '@/components/shared/hoverable-card';
import { Body1, H1, H2 } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

interface BiologicalAgeCardContentProps {
  name: string;
  biologicalAge: number | null;
  ageDifference: number | null;
  showAge: boolean;
}

export const BiologicalAgeCardContent = ({
  name,
  biologicalAge,
  ageDifference,
  showAge,
}: BiologicalAgeCardContentProps) => (
  <div className="relative z-[2] flex size-full flex-col justify-between p-2">
    <div className="mb-8 flex w-full items-start justify-between gap-8">
      <p
        className={cn('text-xl text-white', !showAge && 'mx-auto text-center')}
      >
        Biological Age
      </p>
      {showAge && (
        <H1 className="m-0 shrink-0 text-5xl font-bold text-white">
          {biologicalAge?.toFixed(0) || '--'}
        </H1>
      )}
    </div>

    <div className="mt-auto">
      <H2 className="mb-4 text-2xl text-white">{name}</H2>

      <div className="space-y-0.5">
        {ageDifference !== null && (
          <div className="flex items-center justify-between">
            <Body1 className="text-xl text-white/60">
              Your biological age is
            </Body1>
          </div>
        )}

        {ageDifference !== null && (
          <div className="flex items-center justify-between">
            <Body1 className="text-xl text-white">
              {Math.abs(ageDifference)} years{' '}
              {ageDifference > 0 ? 'younger' : 'older'}
            </Body1>
          </div>
        )}

        {ageDifference !== null && (
          <div className="flex items-center justify-between">
            <Body1 className="text-xl text-white/60">
              than your calendar age
            </Body1>
          </div>
        )}
      </div>
    </div>
  </div>
);

interface BiologicalAgeShareCardProps {
  name: string;
  biologicalAge: number | null;
  ageDifference: number | null;
  className?: string;
  userAvatar?: string;
  forSharing?: boolean;
}

export const BiologicalAgeShareCard = ({
  name,
  biologicalAge,
  ageDifference,
  className,
  userAvatar,
  forSharing = false,
}: BiologicalAgeShareCardProps) => {
  const [showAge, setShowAge] = useState(true);
  const cardWidth = -180;

  return (
    <div
      id="biological-age-share-card"
      className="relative h-[380px] w-64 md:h-[450px] md:w-[320px]"
    >
      <motion.div
        className="relative size-full"
        animate={{
          x: showAge ? 0 : cardWidth,
        }}
        transition={{
          type: 'spring',
          stiffness: 250,
          damping: 40,
        }}
      >
        <motion.div
          className={cn(
            'absolute left-0 top-0',
            showAge
              ? 'scale-100 z-10'
              : 'scale-95 z-0 blur-[4px] pointer-events-none opacity-30',
          )}
          animate={{
            scale: showAge ? 1 : 0.95,
            opacity: showAge ? 1 : 0.3,
            filter: showAge ? 'blur(0px)' : 'blur(4px)',
          }}
          transition={{
            type: 'spring',
            stiffness: 800,
            damping: 30,
          }}
        >
          <HoverableCard
            className={cn(
              className,
              'md:h-[450px] h-[380px] w-64 md:w-[320px] bg-cover bg-[url("/cards/age-card.webp")] outline outline-white/25 -outline-offset-1 relative overflow-hidden',
            )}
            userAvatarImage={userAvatar}
          >
            <BiologicalAgeCardContent
              name={name}
              biologicalAge={biologicalAge}
              ageDifference={ageDifference}
              showAge={true}
            />
          </HoverableCard>
        </motion.div>
        <motion.div
          className={cn(
            'absolute left-[180px] top-0',
            showAge
              ? 'scale-95 z-0 blur-[4px] pointer-events-none opacity-30'
              : 'scale-100 z-10',
          )}
          animate={{
            scale: showAge ? 0.95 : 1,
            opacity: showAge ? 0.3 : 1,
            filter: showAge ? 'blur(4px)' : 'blur(0px)',
          }}
          transition={{
            type: 'spring',
            stiffness: 800,
            damping: 30,
          }}
        >
          <HoverableCard
            className={cn(
              className,
              'md:h-[450px] h-[380px] w-64 md:w-[320px] bg-cover bg-[url("/cards/age-card.webp")] outline outline-white/25 -outline-offset-1 relative overflow-hidden',
            )}
            userAvatarImage={userAvatar}
          >
            <BiologicalAgeCardContent
              name={name}
              biologicalAge={biologicalAge}
              ageDifference={ageDifference}
              showAge={false}
            />
          </HoverableCard>
        </motion.div>
      </motion.div>

      <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 flex w-full -translate-x-1/2 items-center justify-between">
        {[true, false].map((isAgeShown) => (
          <motion.button
            key={isAgeShown.toString()}
            onClick={() => !forSharing && setShowAge(isAgeShown)}
            className={cn(
              'rounded-full p-3 pointer-events-auto relative',
              showAge === isAgeShown
                ? 'bg-white text-zinc-200 cursor-not-allowed'
                : 'bg-white text-zinc-500 hover:text-zinc-700',
              !isAgeShown ? 'md:-right-24 -right-4' : 'md:-left-24 -left-4',
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              opacity: showAge === isAgeShown ? 0.5 : 1,
            }}
            transition={{
              type: 'spring',
              stiffness: 800,
              damping: 30,
            }}
            aria-label={isAgeShown ? 'Show age' : 'Hide age'}
          >
            <ChevronLeft
              className={cn('size-5', !isAgeShown && 'rotate-180')}
            />
          </motion.button>
        ))}
      </div>
    </div>
  );
};
