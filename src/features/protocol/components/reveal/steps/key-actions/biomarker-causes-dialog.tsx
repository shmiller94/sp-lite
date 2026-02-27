import { Description } from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { useCallback, useMemo, useRef, useState } from 'react';

import NumberFlow from '@/components/shared/number-flow';
import { Button } from '@/components/ui/button';
import { TimeSeriesChart } from '@/components/ui/charts/time-series-chart/time-series-chart';
import { getBiomarkerRanges } from '@/components/ui/charts/utils/get-biomarker-ranges';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { dialogVariants } from '@/components/ui/dialog/utils/dialog-variants';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Body1, Body2, Body3, H4 } from '@/components/ui/typography';
import { STATUS_TO_COLOR } from '@/const/status-to-color';
import { BiomarkerContentTabs } from '@/features/data/components/dialogs/biomarker-content-tabs';
import { formatOptimalRange } from '@/features/data/components/dialogs/utils/format-optimal-range';
import { useAnalytics } from '@/hooks/use-analytics';
import { useWindowDimensions } from '@/hooks/use-window-dimensions';
import { cn } from '@/lib/utils';
import { Biomarker } from '@/types/api';

interface BiomarkerCausesDialogProps {
  children: React.ReactNode;
  biomarkers: Biomarker[];
  /** Number of observation references (used to show dialog even if biomarkers not yet resolved) */
  observationCount?: number;
  title?: string;
  disabled?: boolean;
  /** Whether biomarkers are still being loaded/resolved */
  isLoading?: boolean;
}

export const BiomarkerCausesDialog = ({
  children,
  biomarkers,
  observationCount = 0,
  title = "What's causing this?",
  disabled = false,
  isLoading = false,
}: BiomarkerCausesDialogProps) => {
  const [open, setOpen] = useState(false);
  const [selectedBiomarkerIndex, setSelectedBiomarkerIndex] = useState(0);
  const { width } = useWindowDimensions();
  const { track } = useAnalytics();
  const openedAtRef = useRef<string | null>(null);

  const selectedBiomarker = biomarkers[selectedBiomarkerIndex] ?? biomarkers[0];

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      setOpen(newOpen);

      if (newOpen && selectedBiomarker) {
        openedAtRef.current = new Date().toISOString();
        track('viewed_biomarker_causes', {
          biomarker_name: selectedBiomarker.name,
          biomarker_count: biomarkers.length,
        });
      }

      if (!newOpen) {
        if (openedAtRef.current) {
          track('protocol_reveal_biomarker_causes_dialog_closed', {
            biomarker_name: selectedBiomarker?.name,
            biomarker_count: biomarkers.length,
            opened_at: openedAtRef.current,
          });
          openedAtRef.current = null;
        }
        setSelectedBiomarkerIndex(0);
      }
    },
    [selectedBiomarker, biomarkers.length, track],
  );

  // Show dialog if we have observation references, even if biomarkers aren't resolved yet
  const hasContent = biomarkers.length > 0 || observationCount > 0;
  if (!hasContent) {
    return null;
  }

  const loadingContent = (
    <>
      <div className="-mt-3 flex items-center justify-between">
        <DialogTitle>
          <Body1 className="line-clamp-2 font-semibold text-primary">
            {title}
          </Body1>
        </DialogTitle>
        <div className="-mr-3 flex items-center gap-2">
          <DialogClose asChild>
            <Button variant="ghost" className="text-zinc-400">
              <X strokeWidth={2.5} className="size-4" />
            </Button>
          </DialogClose>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {/* Biomarker name and status skeleton */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-7 w-24 rounded-full" />
        </div>

        {/* Chart skeleton */}
        <Skeleton className="h-48 w-full rounded-xl" />

        {/* Markers to address skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-5 w-32" />
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: observationCount || 4 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col gap-1.5 rounded-xl border border-transparent bg-zinc-100 px-3 py-2"
              >
                <Skeleton className="h-4 w-24" />
                <div className="flex items-baseline justify-between gap-2">
                  <Skeleton className="h-5 w-12" />
                  <Skeleton className="h-4 w-16 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs skeleton */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24 rounded-lg" />
            <Skeleton className="h-9 w-24 rounded-lg" />
          </div>
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      </div>
      <Description hidden>Loading biomarker data</Description>
    </>
  );

  const biomarkerContent = selectedBiomarker ? (
    <>
      <div className="-mt-3 flex items-center justify-between">
        <DialogTitle>
          <Body1 className="line-clamp-2 font-semibold text-primary">
            {title}
          </Body1>
        </DialogTitle>
        <div className="-mr-3 flex items-center gap-2">
          <DialogClose asChild>
            <Button variant="ghost" className="text-zinc-400">
              <X strokeWidth={2.5} className="size-4" />
            </Button>
          </DialogClose>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* Biomarker name and status */}
        <div className="flex items-center justify-between">
          <H4 className="text-lg">{selectedBiomarker.name}</H4>
          <BiomarkerStatusBadge biomarker={selectedBiomarker} />
        </div>

        {/* Chart */}
        <TimeSeriesChart biomarker={selectedBiomarker} />

        {/* Markers to address grid */}
        {biomarkers.length > 0 && (
          <div className="space-y-3">
            <Body2 className="font-medium text-primary">
              Markers to address
            </Body2>
            <div className="grid grid-cols-2 gap-2">
              {biomarkers.map((biomarker, index) => (
                <BiomarkerSelectCard
                  key={biomarker.id}
                  biomarker={biomarker}
                  isSelected={index === selectedBiomarkerIndex}
                  onClick={() => {
                    setSelectedBiomarkerIndex(index);
                    track('protocol_reveal_biomarker_selected', {
                      biomarker_name: biomarker.name,
                    });
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <BiomarkerContentTabs biomarker={selectedBiomarker} />
      </div>
      <Description hidden>
        Biomarkers causing health issues - {selectedBiomarker.name}
      </Description>
    </>
  ) : null;

  const content =
    isLoading || !selectedBiomarker ? loadingContent : biomarkerContent;

  if (width <= 1024) {
    return (
      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetTrigger
          asChild
          disabled={disabled}
          className={cn(disabled && 'pointer-events-none')}
        >
          {children}
        </SheetTrigger>
        <SheetContent className="flex h-[calc(100vh-6rem)] flex-col overflow-y-auto rounded-t-3xl p-4 pt-7 md:p-8">
          {content}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        asChild
        disabled={disabled}
        className={cn(disabled && 'pointer-events-none')}
      >
        {children}
      </DialogTrigger>
      <DialogContent
        className={cn(
          'flex flex-col gap-0 overflow-x-hidden',
          dialogVariants({ size: '2xlarge' }),
          'max-h-[70vh] md:min-h-[750px]',
        )}
      >
        {content}
      </DialogContent>
    </Dialog>
  );
};

interface BiomarkerSelectCardProps {
  biomarker: Biomarker;
  isSelected: boolean;
  onClick: () => void;
}

const BiomarkerSelectCard = ({
  biomarker,
  isSelected,
  onClick,
}: BiomarkerSelectCardProps) => {
  const { lastValueSource } = getBiomarkerRanges(biomarker);
  const latestValue = biomarker.value[0]?.quantity?.value;

  const optimalRange = useMemo(() => {
    return biomarker.ranges[lastValueSource]?.find(
      (range) => range.status === 'OPTIMAL',
    );
  }, [biomarker.ranges, lastValueSource]);

  const formattedRange = formatOptimalRange(optimalRange);

  const rangeDisplay = useMemo(() => {
    if (formattedRange.type === 'range') {
      return `${formattedRange.lowValue}-${formattedRange.highValue}`;
    }
    if (formattedRange.type === 'single') {
      return `${formattedRange.symbol}${formattedRange.value}`;
    }
    return '-';
  }, [formattedRange]);

  const statusColor =
    STATUS_TO_COLOR[
      biomarker.status.toLowerCase() as keyof typeof STATUS_TO_COLOR
    ] || STATUS_TO_COLOR.pending;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex flex-col gap-0.5 rounded-xl border px-3 py-2 text-left transition-all',
        isSelected
          ? 'border border-zinc-200 bg-white shadow-sm shadow-black/[.03]'
          : 'border-transparent bg-zinc-100 hover:bg-zinc-50',
      )}
    >
      <Body3 className="truncate text-secondary">{biomarker.name}</Body3>
      <div className="flex items-baseline justify-between gap-2">
        <div className="flex items-baseline gap-1">
          <H4 className="text-base" style={{ color: statusColor }}>
            {latestValue !== undefined ? (
              <NumberFlow value={latestValue} />
            ) : (
              '-'
            )}
          </H4>
          <Body3 className="text-zinc-500">{biomarker.unit}</Body3>
        </div>
        <Body3 className="whitespace-nowrap rounded-md bg-zinc-100 px-1 text-secondary">
          {rangeDisplay}
        </Body3>
      </div>
    </button>
  );
};

const BiomarkerStatusBadge = ({ biomarker }: { biomarker: Biomarker }) => {
  const statusColor =
    STATUS_TO_COLOR[
      biomarker.status.toLowerCase() as keyof typeof STATUS_TO_COLOR
    ];
  const statusColorLight =
    STATUS_TO_COLOR[
      `${biomarker.status.toLowerCase()}_light` as keyof typeof STATUS_TO_COLOR
    ];

  const displayStatus =
    biomarker.status === 'HIGH' || biomarker.status === 'LOW'
      ? 'Out of range'
      : biomarker.status.toLowerCase();

  return (
    <div
      style={{ backgroundColor: statusColorLight }}
      className="flex items-center gap-1.5 rounded-full px-2 py-1"
    >
      <div
        style={{
          backgroundColor: statusColor,
        }}
        className="size-1.5 shrink-0 rounded-full"
      />
      <Body2
        style={{
          color: statusColor,
          backgroundColor: statusColorLight,
        }}
        className="capitalize"
      >
        {displayStatus}
      </Body2>
    </div>
  );
};
