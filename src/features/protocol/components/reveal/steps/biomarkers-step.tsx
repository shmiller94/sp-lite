import { Circle } from 'lucide-react';
import {
  useRef,
  useState,
  MouseEventHandler,
  TouchEventHandler,
  useCallback,
} from 'react';

import { ChevronLeft } from '@/components/icons/chevron-left-icon';
import { SuperpowerUserSignature } from '@/components/shared/superpower-user-signature';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { SparklineChart } from '@/components/ui/charts/sparkline-chart/sparkline-chart';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Body1, Body2, H2, H4, Mono } from '@/components/ui/typography';
import { STATUS_TO_COLOR } from '@/const/status-to-color';
import { useBiomarkers } from '@/features/data/api';
import { BiomarkersDistributionBar } from '@/features/data/components/biomarkers-distribution-bar';
import { BiomarkerDialog } from '@/features/data/components/dialogs/biomarker-dialog';
import { BiomarkerRange } from '@/features/data/components/range';
import { BiomarkerValueUnit } from '@/features/data/components/value-unit';
import { useMarkStepComplete } from '@/features/protocol/api';
import { useUser } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { Biomarker } from '@/types/api';

import { ProtocolLayout } from '../../layouts/protocol-layout';
import { ProtocolHeader } from '../../protocol-header';

type BiomarkersStepProps = {
  carePlanId: string | null;
  next: () => void;
  previous: () => void;
};

function PersonalProtocolCard({ onContinue }: { onContinue: () => void }) {
  const { data, isLoading } = useUser();

  const cardRef = useRef<HTMLDivElement | null>(null);
  const [transform, setTransform] = useState<string>('');
  const [hovering, setHovering] = useState(false);
  const rafRef = useRef<number | null>(null);

  const applyTilt = (clientX: number, clientY: number) => {
    const el = cardRef.current;

    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width;
    const y = (clientY - rect.top) / rect.height;
    const maxTilt = 6;
    const rotateY = (x - 0.5) * maxTilt;
    const rotateX = (0.5 - y) * maxTilt;
    setTransform(
      `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(1.01)`,
    );
  };

  const resetTilt = () => setTransform('');

  const onMouseMove: MouseEventHandler<HTMLDivElement> = (e) => {
    if (!hovering) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() =>
      applyTilt(e.clientX, e.clientY),
    );
  };

  const onTouchMove: TouchEventHandler<HTMLDivElement> = (e) => {
    if (!hovering) return;
    const t = e.touches[0];
    if (!t) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() =>
      applyTilt(t.clientX, t.clientY),
    );
  };

  return (
    <div style={{ perspective: 800 }} className="mx-auto">
      <div
        ref={cardRef}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => {
          setHovering(false);
          resetTilt();
        }}
        onMouseMove={onMouseMove}
        onTouchStart={() => setHovering(true)}
        onTouchEnd={() => {
          setHovering(false);
          resetTilt();
        }}
        onTouchCancel={() => {
          setHovering(false);
          resetTilt();
        }}
        onTouchMove={onTouchMove}
        style={{
          transform: transform || undefined,
          transformStyle: 'preserve-3d',
          transition: hovering
            ? 'transform 60ms linear'
            : 'transform 180ms ease',
        }}
        className="touch-manipulation space-y-6 rounded-3xl border border-zinc-200 bg-white p-4 pt-10 shadow-2xl"
      >
        <div className="space-y-4">
          <Avatar
            className="mx-auto size-24 cursor-default bg-vermillion-700"
            size="large"
            src={
              data?.gender === 'female'
                ? '/user/fallback-avatar-female.webp'
                : '/user/fallback-avatar-male.webp'
            }
          />
          <div>
            {isLoading ? (
              <Skeleton className="mx-auto h-10 w-40" />
            ) : (
              <H4 className="text-center">
                {data?.firstName} {data?.lastName}
              </H4>
            )}
            <H4 className="text-center text-secondary">Personal Protocol</H4>
          </div>
          <Body1 className="max-w-xs text-center text-secondary">
            We’ve analyzed your biomarkers & health goals. Let’s build a
            protocol to improve what’s out of range.
          </Body1>
          <SuperpowerUserSignature />
        </div>
        <Button
          className="w-full"
          onClick={() => {
            onContinue();
          }}
        >
          Build my protocol
        </Button>
      </div>
    </div>
  );
}

function OutOfRangeBiomarker({
  biomarker,
  className,
}: {
  biomarker: Biomarker;
  className?: string;
}) {
  const { status, name } = biomarker;

  return (
    <BiomarkerDialog biomarker={biomarker}>
      <div
        className={cn(
          'flex h-20 grow items-center justify-between rounded-2xl border border-zinc-200 bg-white py-2.5 pl-6 pr-3 shadow shadow-black/[0.025] transition-all hover:cursor-pointer hover:bg-zinc-50',
          className,
        )}
      >
        <div className="flex w-1/2 flex-col items-start xs:w-1/3">
          <div className="flex flex-col justify-start gap-1">
            <div className="flex items-center gap-2.5">
              <Circle
                className="size-2 min-w-2 md:hidden"
                style={{
                  fill: STATUS_TO_COLOR[
                    status.toLowerCase() as keyof typeof STATUS_TO_COLOR
                  ],
                }}
                strokeWidth={0}
              />
              <Body2 className="line-clamp-1 max-w-[200px]">{name}</Body2>
            </div>
          </div>
        </div>

        <div className="flex w-1/2 items-center justify-end gap-2 xs:w-2/3 md:justify-between">
          <TooltipProvider>
            <div className="flex-1">
              <Tooltip delayDuration={75}>
                <TooltipTrigger className="hidden xs:block">
                  <BiomarkerValueUnit
                    result={biomarker?.value[0]}
                    baseUnit={biomarker.unit}
                    textClassName="md:text-xs text-xs"
                  />
                </TooltipTrigger>
                <TooltipContent>Your result</TooltipContent>
              </Tooltip>
            </div>
            <div className="flex flex-1 justify-center">
              <Tooltip delayDuration={75}>
                <TooltipTrigger className="hidden md:block">
                  <BiomarkerRange
                    biomarker={biomarker}
                    className="rounded-lg px-2 py-1.5 text-xs transition-colors duration-200 hover:bg-zinc-200 hover:text-zinc-700"
                  />
                </TooltipTrigger>
                <TooltipContent>Optimal range</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
          <SparklineChart biomarker={biomarker} />
        </div>
      </div>
    </BiomarkerDialog>
  );
}

export function BiomarkersStep({
  carePlanId,
  next,
  previous,
}: BiomarkersStepProps) {
  const { data, isLoading } = useBiomarkers();
  const markStepCompleteMutation = useMarkStepComplete();

  const handleContinue = useCallback(() => {
    if (carePlanId) {
      markStepCompleteMutation.mutate({
        carePlanId,
        step: 'intro',
      });
    }
    next();
  }, [carePlanId, markStepCompleteMutation, next]);

  // filter biomarkers that are out of range (interpretation is 'high' or 'low')
  const outOfRangeBiomarkers =
    data?.biomarkers.filter((biomarker) => {
      const status = biomarker.status.toLowerCase();
      return status === 'high' || status === 'low';
    }) || [];

  return (
    <ProtocolLayout className="lg:pt-24">
      <div className="sticky top-20 hidden w-40 shrink-0 lg:block">
        <Button
          variant="ghost"
          className="group -ml-1.5 flex items-center gap-0.5 p-0"
          onClick={() => {
            previous();
          }}
        >
          <ChevronLeft className="-mt-px w-[15px] text-zinc-400 transition-all duration-150 group-hover:-translate-x-0.5 group-hover:text-zinc-600" />
          <Body2 className="text-zinc-500 transition-all duration-150 group-hover:text-zinc-700">
            Back
          </Body2>
        </Button>
      </div>
      <div className="mx-auto w-full max-w-[680px] space-y-12">
        <ProtocolHeader>
          <Mono className="text-white">Biomarkers</Mono>
          {isLoading ? (
            <Skeleton className="h-20 w-full rounded-xl bg-white/25" />
          ) : (
            <H2 className="text-balance text-white">
              {outOfRangeBiomarkers.length} out of {data?.biomarkers.length}{' '}
              biomarkers require your attention
            </H2>
          )}
          <Body2 className="text-white/80">
            Let’s build your personal protocol to address these and improve your
            health.
          </Body2>
        </ProtocolHeader>
        <div className="space-y-12 px-6 lg:px-0">
          <div className="mb-8 rounded-2xl bg-white p-4 shadow-sm">
            <Body1 className="mb-4">Biomarkers</Body1>
            <BiomarkersDistributionBar />
          </div>
          <div>
            <H4 className="mb-6">Biomarkers to improve:</H4>
            {isLoading ? (
              <div className="mx-auto w-full space-y-2">
                {Array.from({ length: 8 }).map((_, index) => (
                  <Skeleton key={index} className="h-20 w-full rounded-3xl" />
                ))}
              </div>
            ) : (
              outOfRangeBiomarkers.length > 0 && (
                <div className="space-y-2">
                  {outOfRangeBiomarkers.map((biomarker) => (
                    <OutOfRangeBiomarker
                      key={biomarker.id}
                      biomarker={biomarker}
                    />
                  ))}
                </div>
              )
            )}
          </div>
          <div className="pb-16">
            <H4 className="mb-6 text-center">Let’s build your protocol</H4>
            <div className="flex w-full items-center">
              <PersonalProtocolCard onContinue={handleContinue} />
            </div>
          </div>
        </div>
      </div>
      <div className="hidden w-40 shrink-0 lg:block" />
    </ProtocolLayout>
  );
}
