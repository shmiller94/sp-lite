import { Description } from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { dialogVariants } from '@/components/ui/dialog/utils/dialog-variants';
import { Body1 } from '@/components/ui/typography';
import { useBiomarkers } from '@/features/data/api/get-biomarkers';
import { useCategories } from '@/features/data/api/get-categories';
import { encodeCategory } from '@/features/data/utils/category/encode-category';
import { cn } from '@/lib/utils';

import { TimestampCarousel } from '../../timestamp-carousel';

import { CategoryTabs } from './category-tabs';
import { ChartSection } from './chart-section';
import { StatsGrid } from './stats-grid';

export const CategoryDialog = ({
  children,
  category,
  disabled = false,
}: {
  children: React.ReactNode;
  category: string;
  disabled?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const [selectedTimestampIndex, setSelectedTimestampIndex] = useState(0);

  const { data: categories, isLoading: isCategoriesLoading } = useCategories();
  const activeCategoryData = categories?.categories.find(
    (cat) => encodeCategory(cat.category) === encodeCategory(category),
  );

  const { data: biomarkers, isLoading: isBiomarkersLoading } = useBiomarkers({
    category: activeCategoryData?.category,
  });

  const isLoading = isCategoriesLoading || isBiomarkersLoading;

  const timestamps = useMemo(() => {
    if (!biomarkers?.biomarkers) return [];
    const allTimestamps = new Set<string>();
    biomarkers.biomarkers.forEach((biomarker: any) => {
      biomarker.value.forEach((val: any) => {
        allTimestamps.add(val.timestamp);
      });
    });
    return Array.from(allTimestamps).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime(),
    );
  }, [biomarkers]);

  const selectedTimestamp = timestamps[selectedTimestampIndex];

  const filteredBiomarkers = useMemo(() => {
    if (!biomarkers?.biomarkers || !selectedTimestamp) return [];
    return biomarkers.biomarkers
      .map((biomarker: any) => {
        const valueForTimestamp = biomarker.value.find(
          (val: any) => val.timestamp === selectedTimestamp,
        );
        if (!valueForTimestamp) return null;
        return {
          ...biomarker,
          value: [valueForTimestamp],
          status: valueForTimestamp.status || biomarker.status,
        };
      })
      .filter(
        (biomarker: any): biomarker is NonNullable<typeof biomarker> =>
          biomarker !== null,
      );
  }, [biomarkers, selectedTimestamp]);

  const categoryValueForTimestamp = useMemo(() => {
    if (!activeCategoryData || !selectedTimestamp)
      return activeCategoryData?.value;
    return activeCategoryData?.value;
  }, [activeCategoryData, selectedTimestamp]);

  const handleOpenChange = useCallback((newOpen: boolean) => {
    setOpen(newOpen);
  }, []);

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
          'flex flex-col overflow-x-hidden',
          dialogVariants({ size: '2xlarge' }),
          'md:min-h-[750px]',
        )}
      >
        <DialogTitle>
          <Body1 className="text-zinc-400">{category}</Body1>
        </DialogTitle>
        <DialogClose asChild>
          <Button
            variant="ghost"
            className="absolute right-5 top-5 text-zinc-400"
          >
            <X strokeWidth={2.5} className="size-4" />
          </Button>
        </DialogClose>
        <div className="mb-8 flex h-full flex-1 flex-col">
          <ChartSection
            isLoading={isLoading}
            biomarkers={filteredBiomarkers as any}
            value={categoryValueForTimestamp}
            category={category}
          />
          <TimestampCarousel
            timestamps={timestamps}
            onTimestampChange={setSelectedTimestampIndex}
          />
          <StatsGrid biomarkers={filteredBiomarkers as any} />
          <div className="h-full flex-1"></div>
        </div>
        <CategoryTabs category={category} />
        <Description hidden>Insights about {category}</Description>
      </DialogContent>
    </Dialog>
  );
};
