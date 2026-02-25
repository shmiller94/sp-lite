import { ChevronRight } from 'lucide-react';
import { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Body1, H4 } from '@/components/ui/typography';
import { useIsMobile } from '@/hooks/use-mobile';

import { LegacyGoal } from '../../../api';
import { ProtocolIndexNumber } from '../../protocol-index-number';

const DetailContent = ({ title }: { title?: string }) => (
  <div className="p-6">
    <div className="space-y-4">
      <div>
        <Body1 className="font-medium">{title}</Body1>
      </div>
    </div>
  </div>
);

interface GoalsProps {
  goals: LegacyGoal[];
}

export const Goals = ({ goals }: GoalsProps) => {
  const [selectedGoal, setSelectedGoal] = useState<LegacyGoal | null>(null);
  const isMobile = useIsMobile();

  const displayedGoals = goals.slice(0, 3);

  const handleGoalClick = (goal: LegacyGoal) => {
    setSelectedGoal(goal);
  };

  const handleClose = () => {
    setSelectedGoal(null);
  };

  return (
    <>
      <div className="space-y-4">
        <H4>What we are working on</H4>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {displayedGoals.map((goal, index) => (
            <button
              key={goal.id}
              onClick={() => handleGoalClick(goal)}
              className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-4 text-left shadow shadow-black/[.03] outline-none transition-all"
            >
              <div className="absolute inset-0 overflow-hidden">
                <ProtocolIndexNumber
                  index={index}
                  className="absolute left-8 top-4 text-6xl opacity-20 blur-[6px] md:text-8xl"
                />
              </div>

              <div className="relative z-10">
                <div className="mb-4 flex justify-end">
                  <ChevronRight className="size-5 text-zinc-400 transition-all duration-200 ease-out group-hover:translate-x-0.5 group-hover:text-zinc-500" />
                </div>

                <div className="space-y-2">
                  <Body1 className="font-medium leading-tight">
                    {goal.title}
                  </Body1>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedGoal && (
        <>
          {isMobile ? (
            <Sheet open={!!selectedGoal} onOpenChange={handleClose}>
              <SheetContent side="bottom" className="rounded-t-2xl">
                <SheetHeader className="sr-only">
                  <SheetTitle>Goal Details</SheetTitle>
                </SheetHeader>
                <DetailContent title={selectedGoal?.title} />
              </SheetContent>
            </Sheet>
          ) : (
            <Dialog open={!!selectedGoal} onOpenChange={handleClose}>
              <DialogContent className="max-w-md">
                <DialogHeader className="sr-only">
                  <DialogTitle>Goal Details</DialogTitle>
                </DialogHeader>
                <DetailContent title={selectedGoal?.title} />
              </DialogContent>
            </Dialog>
          )}
        </>
      )}
    </>
  );
};
