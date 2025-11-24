import { useParams } from 'react-router-dom';

import { ChevronLeft } from '@/components/icons/chevron-left-icon';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { RevealProgressBar } from './reveal/reveal-progress-bar';

export const ProtocolHeader = ({
  children,
  src = '/action-plan/flora.webp',
  className,
}: {
  children: React.ReactNode;
  src?: string;
  className?: string;
}) => {
  const { goalId } = useParams();

  return (
    <div
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.3)), url(${src})`,
      }}
      className={cn(
        'mb-8 w-full relative overflow-hidden lg:rounded-t-3xl rounded-t-none rounded-b-3xl lg:border border-white/10 bg-cover bg-center',
        className,
      )}
    >
      <div className="relative z-10 mb-12 flex items-center justify-between gap-1 px-4 pt-6 lg:hidden">
        <Button
          variant="ghost"
          onClick={() => {
            history.back();
          }}
        >
          <ChevronLeft className="size-5 text-white" />
        </Button>
        {!goalId && (
          <>
            <RevealProgressBar />
          </>
        )}
      </div>
      <div className="space-y-2 p-8 duration-500 ease-out animate-in fade-in slide-in-from-bottom-8">
        {children}
      </div>
    </div>
  );
};
