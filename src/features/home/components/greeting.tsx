import { motion } from 'framer-motion';
import { useState } from 'react';

import { H2 } from '@/components/ui/typography';
import { useBiomarkers } from '@/features/biomarkers/api';
import { useUser } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { getDaytime } from '@/utils/get-date-time';

import { HomeCards } from './home-cards';
import { SharablesTabType, ShareableModal } from './shareable';

export const GreetingComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeModalTab, setActiveModalTab] =
    useState<SharablesTabType>('superpower-score');

  const { data: user } = useUser();
  const biomarkersQuery = useBiomarkers();

  const handleCardClick = (tabType: SharablesTabType) => {
    setActiveModalTab(tabType);
    setIsModalOpen(true);
  };

  const handleTabChange = (tab: SharablesTabType) => {
    setActiveModalTab(tab);
  };

  const greeting = user?.firstName
    ? `Good ${getDaytime()} ${user.firstName},`
    : `Good ${getDaytime()},`;

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

  return (
    <header
      id="nav-reverse"
      className="size-full h-[700px] overflow-hidden bg-black py-32 md:px-8"
    >
      <div className="relative z-50 mx-auto max-w-6xl">
        <H2 className="mb-8 px-8 text-white md:px-4">
          {greeting} <br />
          <span className="text-white/75">{greetingText}</span>
        </H2>

        <ShareableModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          openTab={activeModalTab}
          onTabChange={handleTabChange}
        />
        <HomeCards onClick={handleCardClick} />
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
