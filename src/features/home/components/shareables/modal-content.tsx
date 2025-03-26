import { AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { createBiologicalAgeShareCard } from './biological-age-share-card';
import { createScoreShareCard } from './score-share-card';
import {
  ShareCardContainer,
  LoadingShareCardContent,
} from './share-card-container';
import { ShareablesTabs, TabType } from './tabs';

interface ShareablesModalContentProps {
  children?: ReactNode;
  userName: string;
  healthScoreData?: any;
  biologicalAge?: number | null;
  ageDifference?: number | null;
  userAvatar?: string;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  showScoreShareCard?: boolean;
}

export const ShareablesModalContent = ({
  children,
  userName,
  healthScoreData,
  biologicalAge,
  ageDifference,
  userAvatar,
  activeTab,
  onTabChange,
  showScoreShareCard = true,
}: ShareablesModalContentProps) => {
  if (children) {
    return <>{children}</>;
  }

  if (!showScoreShareCard) {
    return null;
  }

  return (
    <div className="flex h-full flex-col items-center justify-between px-4 py-8 pt-0">
      <ShareablesTabs activeTab={activeTab} onTabChange={onTabChange} />

      <AnimatePresence mode="wait">
        <div
          className="flex flex-col items-center justify-center"
          key={`${activeTab}-container`}
        >
          {activeTab === 'superpower-score' ? (
            healthScoreData ? (
              <ShareCardContainer cardKey="superpower-score">
                {createScoreShareCard(userName, healthScoreData, userAvatar)}
              </ShareCardContainer>
            ) : (
              <LoadingShareCardContent
                title="Your Superpower Score"
                message="Once your lab results are processed, your Superpower Score will appear here."
              />
            )
          ) : biologicalAge ? (
            <ShareCardContainer cardKey="biological-age">
              {createBiologicalAgeShareCard(
                userName,
                biologicalAge ?? null,
                ageDifference ?? null,
                userAvatar,
                false,
              )}
            </ShareCardContainer>
          ) : (
            <LoadingShareCardContent
              title="Your Biological Age"
              message="Once your lab results are processed, your Biological Age will appear here."
            />
          )}
          <div />
        </div>
      </AnimatePresence>

      <div className="mt-16 flex w-full items-center justify-center">
        {activeTab === 'superpower-score' && (
          <Link
            to="./data?modal=superpower-score"
            className="text-secondary transition-colors duration-200 hover:text-zinc-600"
          >
            What is the Superpower Score?
          </Link>
        )}
      </div>
    </div>
  );
};
