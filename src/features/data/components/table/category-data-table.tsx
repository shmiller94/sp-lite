import { useEffect, useState, useTransition } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { useOrders } from '@/features/orders/api';
import { cn } from '@/lib/utils';
import { Category } from '@/types/api';

import { useBiomarkers } from '../../api';
import { useFilteredBiomarkers } from '../../hooks/use-filtered-biomarkers';
import { useDataFilterStore } from '../../stores/data-filter-store';
import { DataSearch } from '../filter/data-search';
import { DateFilter } from '../filter/date-filter';
import { RangesFilter } from '../filter/ranges-filter';

import { BiomarkersDataTable } from './biomarkers-data-table';

export const CategoryDataTable = ({ category }: { category?: Category }) => {
  const {
    data: orders,
    isLoading: isOrdersLoading,
    isFetching: isOrdersFetching,
  } = useOrders();
  const {
    data: biomarkers,
    isLoading: isBiomarkersLoading,
    isFetching: isBiomarkersFetching,
  } = useBiomarkers({
    category: category?.category,
  });

  const filteredBiomarkers = useFilteredBiomarkers({
    biomarkers: biomarkers?.biomarkers,
    orders: orders?.orders,
    enabledFilters: { categories: false, date: true, range: true },
  });

  const searchQuery = useDataFilterStore((s) => s.searchQuery);
  const updateSearchQuery = useDataFilterStore((s) => s.updateSearchQuery);
  const [localQuery, setLocalQuery] = useState(searchQuery);
  useEffect(() => setLocalQuery(searchQuery), [searchQuery]);
  const [_, startTransition] = useTransition();
  const debouncedUpdate = useDebouncedCallback((q: string) => {
    startTransition(() => updateSearchQuery(q));
  }, 200);

  const isLoading =
    isOrdersLoading ||
    isBiomarkersLoading ||
    isOrdersFetching ||
    isBiomarkersFetching;

  return (
    <div>
      <div
        className={cn(
          'sticky md:top-20 top-4 z-10 bg-gradient-to-b from-zinc-50 to-transparent transition-all duration-500',
        )}
      >
        <div
          className={cn(
            'transition-all mx-auto flex-1 overflow-y-auto rounded-3xl bg-white border border-zinc-100 shadow-md shadow-black/[.02] scrollbar scrollbar-track-transparent scrollbar-thumb-zinc-300',
          )}
        >
          <div className="flex flex-col gap-4">
            <div className="flex h-28 flex-col justify-between border-t border-t-zinc-100 py-2 md:h-auto md:flex-row md:items-center md:gap-4 md:px-3">
              <DataSearch
                value={localQuery}
                onChange={(e) => {
                  const q = e.target.value;
                  setLocalQuery(q);
                  debouncedUpdate(q);
                }}
              />
              <div className="flex items-center gap-1.5 px-2.5 md:px-0">
                <RangesFilter />
                <DateFilter />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto min-h-screen">
        <BiomarkersDataTable
          biomarkers={filteredBiomarkers}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
