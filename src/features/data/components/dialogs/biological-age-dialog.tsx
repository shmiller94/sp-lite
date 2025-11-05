import { Description } from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { TimeSeriesChart } from '@/components/ui/charts/time-series-chart/time-series-chart';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { dialogVariants } from '@/components/ui/dialog/utils/dialog-variants';
import { SimpleTabs, SimpleTabsContent } from '@/components/ui/simple-tabs';
import { Body1 } from '@/components/ui/typography';
import { AgeShareCard } from '@/features/shareables/components/cards/age-share-card';
import { SharingOptionsModal } from '@/features/shareables/components/sharing-options-modal';
import { cn } from '@/lib/utils';

import { useBiomarkers } from '../../api';

import { BiomarkerContentTabs } from './biomarker-content-tabs';

const tabs = [
  {
    label: 'Trend View',
    value: 'chart',
  },
  {
    label: 'Score Card',
    value: 'card',
  },
];

export const BiologicalAgeDialog = ({
  children,
  disabled = false,
}: {
  children: React.ReactNode;
  disabled?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const [sharingOptionsOpen, setSharingOptionsOpen] = useState(false);
  const [showAge, setShowAge] = useState(false);
  const { data: biomarkersData } = useBiomarkers();
  const biologicalAgeMarker = biomarkersData?.biomarkers.find(
    (b) => b.name == 'Biological Age',
  );

  const [selectedTab, setSelectedTab] =
    useState<(typeof tabs)[number]['value']>('chart');

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          asChild
          disabled={disabled}
          className={cn(disabled && 'pointer-events-none')}
        >
          {children}
        </DialogTrigger>
        <DialogContent
          className={cn(
            'flex flex-col',
            dialogVariants({ size: '2xlarge' }),
            'md:min-h-[750px] max-h-[70vh]',
            sharingOptionsOpen && '-mt-10 scale-[.92] opacity-75',
          )}
        >
          <div className="-mt-3 flex items-center justify-between">
            <DialogTitle>
              <Body1 className="line-clamp-2 text-zinc-400">
                Biological Age
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
          <SimpleTabs
            tabs={tabs}
            defaultTab={selectedTab}
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="mb-8 flex flex-1 flex-col items-center justify-between gap-8"
          >
            <SimpleTabsContent
              className="flex w-full flex-1 flex-col justify-center"
              value="chart"
            >
              <TimeSeriesChart biomarker={biologicalAgeMarker!} />
            </SimpleTabsContent>
            <SimpleTabsContent className="w-full" value="card">
              <AgeShareCard showAge={showAge} setShowAge={setShowAge} />
            </SimpleTabsContent>
          </SimpleTabs>

          {biologicalAgeMarker && (
            <BiomarkerContentTabs biomarker={biologicalAgeMarker} />
          )}

          <Description hidden>
            Information about the biological age.
          </Description>
        </DialogContent>
      </Dialog>
      <SharingOptionsModal
        open={sharingOptionsOpen}
        onOpenChange={setSharingOptionsOpen}
        cardType={showAge ? 'age' : 'age-hidden'}
      />
    </>
  );
};
