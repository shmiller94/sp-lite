import { motion } from 'framer-motion';
import { useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Body1, H3 } from '@/components/ui/typography';
import { getGenderBasedValue } from '@/features/onboarding/utils/get-gender-based-value';
import { useUser } from '@/lib/auth';

const ProgressCircle = ({ progress }: { progress: number }) => {
  const rectangles = 96;
  const radius = 200;

  return (
    <motion.svg
      width="500"
      height="500"
      viewBox="0 0 500 500"
      className="hidden size-full md:block"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {Array.from({ length: rectangles }).map((_, i) => {
        const baseAngle = (i * 360) / rectangles - 90;
        const randomOffset = (Math.random() - 0.5) * 4;
        const angle = baseAngle + randomOffset;
        const radians = (angle * Math.PI) / 180;
        const x = 250 + radius * Math.cos(radians);
        const y = 250 + radius * Math.sin(radians);
        const rectangleProgress = i / rectangles;
        const shouldShow = rectangleProgress < progress;
        const height = Math.floor(Math.random() * 48) + 8;

        return (
          <motion.rect
            key={i}
            x={x - 2}
            y={y}
            width="1"
            height={height}
            fill="white"
            transform={`rotate(${angle + 90}, ${x}, ${y})`}
            initial={{ opacity: 0.2, height: 0 }}
            animate={{
              opacity: shouldShow ? 1 : 0.2,
              height: height,
            }}
            transition={{
              opacity: {
                duration: 0.2,
                delay: (i / rectangles) * 2,
                ease: 'easeOut',
              },
              height: {
                duration: 0.2,
                delay: (i / rectangles) * 1,
                ease: 'easeOut',
              },
            }}
          />
        );
      })}
    </motion.svg>
  );
};

export const UpsellItemCover = ({
  title,
  femaleTitle,
  description,
  circularProgress,
  source,
  foregroundImage,
  femaleForegroundImage,
  backgroundImage,
  goToNext,
}: {
  title: string;
  femaleTitle?: string;
  description: string;
  circularProgress: number;
  source: string;
  foregroundImage: string;
  femaleForegroundImage?: string;
  backgroundImage: string;
  goToNext: () => void;
}) => {
  const { data: user, isLoading } = useUser();

  const statisticTitle = useMemo(() => {
    return getGenderBasedValue(user?.gender, title, {
      female: femaleTitle,
    });
  }, [title, femaleTitle, user?.gender]);

  const coverImage = useMemo(() => {
    return getGenderBasedValue(user?.gender, foregroundImage, {
      female: femaleForegroundImage,
    });
  }, [foregroundImage, femaleForegroundImage, user?.gender]);

  return (
    <>
      <div className="absolute left-1/2 top-1/2 z-50 mx-auto flex w-full max-w-[calc(100%-48px)] -translate-x-1/2 -translate-y-1/2 flex-col justify-center gap-4 rounded-2xl bg-[#563D3D]/20 p-6 backdrop-blur-2xl md:static md:size-full md:translate-x-0 md:translate-y-0 md:bg-transparent lg:max-w-[512px]">
        {femaleTitle && isLoading ? (
          <Skeleton className="h-12 w-full rounded-xl" />
        ) : (
          <H3 className="text-white md:text-primary">{statisticTitle}</H3>
        )}
        <Body1 className="mb-4 text-white md:text-zinc-500">
          {description}
        </Body1>
        <Button onClick={goToNext} className="hidden md:block">
          Continue
        </Button>
      </div>
      <div
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
        className="absolute top-1/2 flex h-dvh w-full -translate-y-1/2 items-center justify-center overflow-hidden bg-cover bg-center md:relative md:order-first md:size-full md:rounded-3xl md:p-24 lg:order-last"
      >
        <div className="pointer-events-none absolute bottom-0 z-30 h-96 w-full bg-gradient-to-b from-transparent to-[#8F7E6E]/40" />
        <div className="absolute inset-0 top-auto z-20 mx-auto size-full max-h-[80%]">
          {!isLoading && (
            <img
              className="size-full object-cover object-top duration-1000 animate-in fade-in lg:object-contain lg:object-bottom"
              src={coverImage}
              alt={`${title} person standing in front of a circle`}
            />
          )}
        </div>
        <ProgressCircle progress={circularProgress} />
        <div className="absolute bottom-4 left-1/2 z-50 w-full -translate-x-1/2 space-y-4 px-4">
          <p className="text-center text-xs text-white/60">Source: {source}</p>
          <Button
            onClick={goToNext}
            className="w-full md:hidden"
            variant="white"
          >
            Continue
          </Button>
        </div>
      </div>
    </>
  );
};
