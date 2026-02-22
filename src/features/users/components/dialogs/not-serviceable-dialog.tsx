import { DialogClose } from '@radix-ui/react-dialog';
import { RiveFile, useRive, useRiveFile } from '@rive-app/react-canvas-lite';
import { XIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { NotServiceableReason } from '@/types/api';

export const NotServiceableDialog = ({
  reason,
  onClick,
  variant = 'modal',
}: {
  reason?: NotServiceableReason;
  variant?: 'modal' | 'block';
  onClick: () => void;
}) => {
  const { riveFile } = useRiveFile({
    src: '/animations/superpower.riv',
  });

  if (!riveFile) return null;

  const content = (
    <div>
      <div className="relative h-48 w-full overflow-hidden">
        <BloodtubeAnimation riveFile={riveFile} />
        <div className="absolute bottom-0 h-20 w-full bg-gradient-to-b from-transparent via-white/75 to-white" />
      </div>
      <div className="mb-8 flex flex-col gap-1.5">
        <DialogTitle className="text-center text-xl font-normal tracking-[-0.48px] text-zinc-900 md:text-2xl">
          {reason === 'state-not-serviceable'
            ? 'More locations coming soon'
            : 'No nearby providers at your address'}
        </DialogTitle>
        <DialogDescription className="text-center text-base text-secondary">
          We&apos;re not live in your area just yet — but we&apos;ll let you
          know the moment we launch near you.
          <br />
          We&apos;re expanding rapidly, so it won&apos;t be long.
        </DialogDescription>
      </div>
      <Button
        onClick={onClick}
        className={cn(
          'w-full py-3',
          variant === 'block' ? 'rounded-full' : null,
        )}
      >
        Return to address details
      </Button>
    </div>
  );

  if (variant === 'block') return reason ? content : null;

  return (
    <Dialog open={!!reason}>
      <DialogContent className="max-w-[95vw] p-8 sm:max-w-[525px]">
        <DialogClose asChild className="absolute right-6 top-6">
          <Button
            onClick={onClick}
            variant="ghost"
            size="icon"
            className="rounded-full"
          >
            <XIcon className="size-4 text-zinc-500 transition-colors duration-200 hover:text-zinc-600" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogClose>
        {content}
      </DialogContent>
    </Dialog>
  );
};

const BloodtubeAnimation = ({ riveFile }: { riveFile: RiveFile }) => {
  const { RiveComponent } = useRive({
    riveFile: riveFile ?? undefined,
    autoplay: true,
    artboard: 'blood-tube',
    animations: ['rotate'],
  });

  return (
    <RiveComponent className="h-80 w-full duration-700 animate-in fade-in-0" />
  );
};
