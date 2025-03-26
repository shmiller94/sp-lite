import { motion } from 'framer-motion';
import { useState } from 'react';

import { useBiomarkers } from '@/features/biomarkers/api';
import { calculateDNAmAge } from '@/features/biomarkers/utils/calculate-dnam-age';
import { useUser } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { yearsSinceDate } from '@/utils/format';

import { ShareablesModal } from '../components/shareables';

import { DesktopCards } from './desktop-cards';
import { MobileCarousel } from './mobile-carousel';
import { getDaytime } from './utils';

export const GreetingComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<
    'superpower-score' | 'biological-age'
  >('superpower-score');

  const { data: userData } = useUser();
  const biomarkersQuery = useBiomarkers();

  const dateOfBirth = userData?.dateOfBirth || '';
  const biologicalAge = calculateDNAmAge(
    biomarkersQuery.data?.biomarkers ?? [],
    dateOfBirth,
  );
  const ageDifference = biologicalAge
    ? Math.round((yearsSinceDate(dateOfBirth) - biologicalAge) * 10) / 10.0
    : null;

  const healthScoreData = biomarkersQuery.data?.biomarkers?.find(
    (b) => b.name === 'Health Score',
  );

  const handleCardClick = (tabType: 'superpower-score' | 'biological-age') => {
    setActiveModalTab(tabType);
    setIsModalOpen(true);
  };

  const greeting = userData?.firstName
    ? `Good ${getDaytime()} ${userData.firstName},`
    : `Good ${getDaytime()},`;

  const userName = userData
    ? `${userData.firstName} ${userData.lastName}`
    : 'User';

  const greetingText = 'Welcome to Superpower';

  const backgroundImageVariants = {
    initial: { scale: 1.2, opacity: 1 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 5,
        ease: [0.25, 0.1, 0.25, 1.0],
      },
    },
  };

  const cards = [
    {
      type: 'superpower-score' as const,
      onClick: () => handleCardClick('superpower-score'),
    },
    {
      type: 'biological-age' as const,
      onClick: () => handleCardClick('biological-age'),
    },
    {
      type: 'protocol' as const,
      onClick: undefined,
    },
  ] as const;

  const dataState = biomarkersQuery.isLoading ? 'loading' : 'loaded';

  return (
    <header
      id="nav-reverse"
      className="size-full h-[700px] overflow-hidden bg-black py-32 md:px-8"
    >
      <div className="relative z-50 mx-auto max-w-6xl">
        <div
          className={cn(
            'transition-all duration-1000',
            biomarkersQuery.isLoading
              ? 'opacity-0 blur-sm'
              : 'opacity-100 blur-none',
          )}
        >
          <h1 className="duration-[5s] mb-8 px-8 text-2xl tracking-tight text-white transition-all delay-300 md:px-0 md:text-3xl">
            {greeting} <br />
            <span className="text-white/75">{greetingText}</span>
          </h1>
        </div>

        <ShareablesModal
          trigger={<div className="hidden" />}
          userName={userName}
          healthScoreData={healthScoreData}
          biologicalAge={biologicalAge}
          ageDifference={ageDifference}
          openTab={activeModalTab}
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
        />

        <DesktopCards
          cards={cards}
          dataState={dataState}
          healthScoreData={healthScoreData}
          biologicalAge={biologicalAge}
          ageDifference={ageDifference}
        />

        <div className="md:hidden">
          <MobileCarousel
            cards={cards}
            dataState={dataState}
            healthScoreData={healthScoreData}
            biologicalAge={biologicalAge}
            ageDifference={ageDifference}
          />
        </div>
      </div>

      <div
        className={cn(
          'progressive-blur pointer-events-none absolute left-1/2 top-0 z-10 max-w-[1800px] -translate-x-1/2 transition-opacity duration-500 delay-75',
          biomarkersQuery.isLoading
            ? 'opacity-0 invisible'
            : 'opacity-100 visible',
        )}
      />

      <div
        className="absolute left-1/2 top-0 z-20 size-full h-full max-w-[2012px] -translate-x-1/2 scale-150"
        style={{
          backgroundImage:
            'linear-gradient(to right, black 0%, transparent 5%, transparent 95%, black 100%)',
        }}
      />

      <div className="absolute left-1/2 top-0 size-full max-w-[2010px] -translate-x-1/2 scale-150 overflow-hidden">
        <motion.img
          src="/user/backgrounds/default.webp"
          alt="Greeting"
          className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-[640px] w-full max-w-[2000px] object-cover object-top blur-sm"
          variants={backgroundImageVariants}
          initial="initial"
          animate="animate"
        />
      </div>
    </header>
  );
};
