import { DialogTitle } from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { ReactNode, useState, useEffect } from 'react';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

import { ShareablesModalContent } from './modal-content';
import { TabType } from './tabs';

interface ShareablesModalProps {
  children?: ReactNode;
  trigger: ReactNode;
  className?: string;
  userName?: string;
  healthScoreData?: any;
  showScoreShareCard?: boolean;
  biologicalAge?: number | null;
  ageDifference?: number | null;
  userAvatar?: string;
  openTab?: TabType;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const ShareablesModal = ({
  children,
  trigger,
  className,
  userName = 'User',
  healthScoreData,
  showScoreShareCard = true,
  biologicalAge,
  ageDifference,
  userAvatar,
  openTab = 'superpower-score',
  open,
  onOpenChange,
}: ShareablesModalProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>(openTab);

  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = onOpenChange
    ? (value: boolean) => onOpenChange(value)
    : setInternalOpen;

  useEffect(() => {
    setActiveTab(openTab);
  }, [openTab]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
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
          <div className="absolute left-4 top-20 z-10 md:right-0 md:top-4">
            <DialogClose>
              <div className="flex size-10 items-center justify-center rounded-full bg-white shadow-md">
                <X className="size-5" />
              </div>
            </DialogClose>
          </div>
          <div className="flex size-full items-center justify-center overflow-auto">
            <ShareablesModalContent
              userName={userName}
              healthScoreData={healthScoreData}
              biologicalAge={biologicalAge}
              ageDifference={ageDifference}
              userAvatar={userAvatar}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              showScoreShareCard={showScoreShareCard}
            >
              {children}
            </ShareablesModalContent>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
