import { XIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';

import { useScheduleDuplicate } from '../../hooks/use-schedule-duplicate';
import { useScheduleStore } from '../../stores/schedule-store';

import { useScheduleFlowStepper } from './schedule-stepper';

export const ScheduleDuplicateNotice = () => {
  const [open, setOpen] = useState(true);
  const slot = useScheduleStore((s) => s.slot);
  const { nearestMatchingDupe, dupeDate } = useScheduleDuplicate();
  const { next } = useScheduleFlowStepper();

  const close = () => setOpen(false);

  const slotKey = useMemo(
    () => (slot?.start ? new Date(slot.start).toISOString() : null),
    [slot],
  );

  useEffect(() => {
    if (!slotKey || !nearestMatchingDupe) return;

    const timeoutId = setTimeout(() => {
      setOpen(true);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [slotKey, nearestMatchingDupe]);

  if (!nearestMatchingDupe) return null;

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-[95vw] p-8 sm:max-w-[525px]">
        <DialogClose asChild className="absolute right-6 top-6">
          <Button
            onClick={close}
            variant="ghost"
            size="icon"
            className="rounded-full"
          >
            <XIcon className="size-4 text-zinc-500 transition-colors duration-200 hover:text-zinc-600" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogClose>
        <div>
          <div className="relative h-48 w-full overflow-hidden">
            <img
              src="/services/upgrade/baseline-panel.png"
              alt="panel"
              className="pointer-events-none mx-auto h-[180px] w-full select-none object-contain pt-4"
            />
            <div className="absolute bottom-0 h-20 w-full bg-gradient-to-b from-transparent via-white/75 to-white" />
          </div>
          <div className="mb-8 flex flex-col gap-1.5">
            <DialogTitle className="text-center text-xl font-normal tracking-[-0.48px] text-zinc-900 md:text-2xl">
              Similar test already scheduled
            </DialogTitle>
            <DialogDescription className="text-center text-base text-secondary">
              This panel measures biomarkers that are similar to a test you have
              already scheduled{' '}
              {nearestMatchingDupe?.startTimestamp ? ` on ${dupeDate}` : ''}. We
              recommend scheduling these blood draws at least 1 month apart so
              you have time in between tests to see trends.
            </DialogDescription>
          </div>
          <div className="flex flex-col gap-2">
            <Button onClick={close}>Schedule Later</Button>
            <Button variant="outline" onClick={next}>
              Ignore and Continue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
