import { DialogTitle } from '@radix-ui/react-dialog';
import { AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Dialog, DialogClose, DialogContent } from '@/components/ui/dialog';
import { Sheet, SheetClose, SheetContent } from '@/components/ui/sheet';
import { Body1 } from '@/components/ui/typography';
import { useBiomarkers } from '@/features/biomarkers/api';
import { mostRecent } from '@/features/biomarkers/utils/most-recent-biomarker';
import { BiologicalAgeShareCard } from '@/features/home/components/shareable/biological-age-share-card';
import { ScoreShareCard } from '@/features/home/components/shareable/score-share-card';
import {
  LoadingShareCardContent,
  ShareCardContainer,
} from '@/features/home/components/shareable/share-card-container';
import { useWindowDimensions } from '@/hooks/use-window-dimensions';
import { useUser } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { yearsSinceDate } from '@/utils/format';

import { ShareablesTabs, SharablesTabType } from './tabs';

interface ShareablesModalProps {
  className?: string;
  openTab: SharablesTabType;
  open?: boolean;
  onOpenChange?: (value: boolean) => void;
  onTabChange: (tab: SharablesTabType) => void;
}

export const ShareableModal = ({
  className,
  openTab,
  open,
  onOpenChange,
  onTabChange,
}: ShareablesModalProps) => {
  const { data: user } = useUser();
  const getBiomarkersQuery = useBiomarkers();
  const latestScore = mostRecent(
    getBiomarkersQuery.data?.biomarkers.find((b) => b.name == 'Health Score')
      ?.value ?? [],
  );

  const biologicalAgeMarker = getBiomarkersQuery.data?.biomarkers.find(
    (b) => b.name == 'Biological Age',
  );
  const biologicalAge =
    mostRecent(biologicalAgeMarker?.value ?? [])?.quantity.value ?? null;

  const ageDifference =
    biologicalAge && user?.dateOfBirth
      ? Math.round((yearsSinceDate(user.dateOfBirth) - biologicalAge) * 10) /
        10.0
      : null;

  const [internalOpen, setInternalOpen] = useState(false);
  const { width } = useWindowDimensions();

  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = onOpenChange
    ? (value: boolean) => onOpenChange(value)
    : setInternalOpen;

  const userName = user ? `${user.firstName} ${user.lastName}` : 'User';

  const content = (
    <div className="flex h-full flex-col items-center justify-between px-4 py-8 pt-0">
      <ShareablesTabs activeTab={openTab} onTabChange={onTabChange} />

      <AnimatePresence mode="wait">
        <div
          className="flex flex-col items-center justify-center"
          key={`${openTab}-container`}
        >
          {openTab === 'superpower-score' ? (
            latestScore ? (
              <ShareCardContainer cardKey="superpower-score">
                <ScoreShareCard
                  name={userName}
                  score={latestScore.quantity.value}
                />
              </ShareCardContainer>
            ) : (
              <LoadingShareCardContent
                title="Your Superpower Score"
                message="Once your lab results are processed, your Superpower Score will appear here."
              />
            )
          ) : biologicalAge && ageDifference ? (
            <ShareCardContainer cardKey="biological-age">
              <BiologicalAgeShareCard
                name={userName}
                biologicalAge={biologicalAge}
                ageDifference={ageDifference}
              />
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
        {openTab === 'superpower-score' && (
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

  if (width <= 768) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="flex h-screen max-h-full flex-col overflow-hidden bg-zinc-100">
          <div className="relative flex size-full flex-col pt-8">
            <div className="absolute left-4 top-4 z-10">
              <SheetClose>
                <div className="flex size-10 items-center justify-center rounded-full bg-white shadow-md">
                  <X className="size-5" />
                </div>
              </SheetClose>
            </div>
            <Body1 className="mb-8 text-center">Shareable Cards</Body1>
            <div className="flex size-full items-center justify-center overflow-hidden">
              {content}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className={cn(
          'fixed max-w-none max-h-none rounded-none z-[999] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-screen w-screen bg-zinc-100 shadow-lg outline-none',
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          'data-[state=closed]:slide-out-to-center data-[state=open]:slide-in-from-center',
          'perspective-dramatic',
          className,
        )}
      >
        <DialogTitle className="hidden">Shareables</DialogTitle>
        <div className="relative flex size-full flex-col">
          <div className="absolute left-4 top-4 z-10">
            <DialogClose>
              <div className="flex size-10 items-center justify-center rounded-full bg-white shadow-md">
                <X className="size-5" />
              </div>
            </DialogClose>
          </div>
          <div className="flex size-full items-center justify-center overflow-auto">
            {content}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
