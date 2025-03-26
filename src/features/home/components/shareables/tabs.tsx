import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';

export type TabType = 'superpower-score' | 'biological-age';

interface ShareablesTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const ShareablesTabs = ({
  activeTab,
  onTabChange,
}: ShareablesTabsProps) => {
  return (
    <div className="pl-10 md:p-4">
      <div className="relative mb-8 mt-[78px] flex h-12 w-[calc(100vw-8rem)] gap-0 truncate md:mt-2 md:w-96">
        <motion.div
          className="absolute inset-0 w-1/2 rounded-full bg-white"
          initial={{ x: activeTab === 'superpower-score' ? 0 : '100%' }}
          animate={{ x: activeTab === 'superpower-score' ? 0 : '100%' }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        />
        <button
          onClick={() => onTabChange('superpower-score')}
          className={cn(
            'rounded-full flex-1 transition-all duration-300 relative z-10 truncate px-2 md:text-base text-sm',
            activeTab === 'superpower-score'
              ? 'text-black'
              : 'text-secondary hover:text-black',
          )}
        >
          Superpower Score
        </button>
        <button
          onClick={() => onTabChange('biological-age')}
          className={cn(
            'rounded-full flex-1 transition-all duration-300 relative z-10 truncate px-2 md:text-base text-sm',
            activeTab === 'biological-age'
              ? 'text-black'
              : 'text-secondary hover:text-black',
          )}
        >
          Biological Age
        </button>
      </div>
    </div>
  );
};
