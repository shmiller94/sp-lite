import { useSearchParams } from 'react-router-dom';

import { ScoreChart } from '@/components/ui/charts/score-chart/score-chart';
import { Skeleton } from '@/components/ui/skeleton';
import { H4 } from '@/components/ui/typography';

import { useBiomarkers } from '../api';
import { useCategories } from '../api/get-categories';
import { encodeCategory } from '../utils/category/encode-category';

import { BiomarkerSkeletonRow } from './table/biomarker-skeleton-row';
import { CategoryDataTable } from './table/category-data-table';

export const CategoryView = () => {
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get('category');

  const { data: categories, isLoading: isCategoriesLoading } = useCategories();
  const activeCategoryData = categories?.categories.find(
    (category) =>
      encodeCategory(category.category) ===
      encodeCategory(activeCategory ?? ''),
  );

  const { data: biomarkers, isLoading: isBiomarkersLoading } = useBiomarkers({
    category: activeCategoryData?.category,
  });

  const isLoading = isCategoriesLoading || isBiomarkersLoading;

  if (!activeCategoryData) {
    return null;
  }

  return (
    <div className="w-full space-y-4">
      <div className="mx-auto w-full flex-1 overflow-visible rounded-[24px] border-none bg-white p-6 scrollbar scrollbar-track-transparent scrollbar-thumb-zinc-300 hover:bg-white/80">
        <H4>{activeCategoryData?.category}</H4>
        <div className="flex w-full items-center justify-center py-2">
          {isLoading ? (
            <div className="flex size-full items-center justify-center gap-4">
              <Skeleton className="size-28 rounded-full" />
            </div>
          ) : (
            <ScoreChart
              biomarkers={biomarkers?.biomarkers ?? []}
              value={activeCategoryData?.value}
            />
          )}
        </div>
      </div>
      {isLoading ? (
        <div className="mt-8 w-full space-y-2">
          {Array.from({ length: 10 }).map((_, index) => (
            <BiomarkerSkeletonRow key={index} />
          ))}
        </div>
      ) : (
        <div className="w-full">
          <CategoryDataTable category={activeCategoryData} />
        </div>
      )}
    </div>
  );
};
