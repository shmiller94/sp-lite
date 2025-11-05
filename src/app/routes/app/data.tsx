import { useNavigate, useSearchParams } from 'react-router-dom';

import { ContentLayout } from '@/components/layouts';
import { Button } from '@/components/ui/button';
import { Body1, H2 } from '@/components/ui/typography';
import { useCategories } from '@/features/data/api/get-categories';
import { CategoryView } from '@/features/data/components/category-view';
import { Overview } from '@/features/data/components/overview';
import { DataSidebar } from '@/features/data/components/sidebar/data-sidebar';
import { encodeCategory } from '@/features/data/utils/category/encode-category';
import { DigitalTwin } from '@/features/digital-twin/components/digital-twin';

export const DataRoute = () => {
  const [searchParams] = useSearchParams();
  const { data: categories, isLoading } = useCategories();
  const navigate = useNavigate();

  const category = searchParams.get('category');
  const activeCategory = categories?.categories.find(
    (c) => encodeCategory(c.category) === encodeCategory(category ?? ''),
  );

  // Handle the case where the category is not found
  if (
    category &&
    !isLoading &&
    !categories?.categories.some(
      (c) => encodeCategory(c.category) === encodeCategory(category),
    )
  ) {
    return (
      <div className="flex h-full min-h-[calc(100vh-100px)] flex-col items-center justify-center gap-2">
        <H2 className="text-center">Category not found.</H2>
        <Body1 className="mb-2 text-center text-zinc-500">
          Sorry, we didn&apos;t discover this superpower yet.
        </Body1>
        <Button
          className="mt-4"
          variant="outline"
          onClick={() => navigate('/data')}
        >
          Back to overview
        </Button>
      </div>
    );
  }

  return (
    <ContentLayout title="Data">
      <div className="mt-[5px] flex size-full min-h-[calc(100vh-256px)] flex-1 flex-col overflow-visible md:grid md:grid-cols-9">
        <DataSidebar />
        <div className="top-0 z-0 col-span-3 mb-[-40px] h-[512px] max-h-[50vh] md:sticky md:-mt-16 md:h-full md:max-h-[60vh]">
          {!isLoading && <DigitalTwin category={activeCategory} />}
        </div>
        <div className="relative z-10 col-span-5 bg-zinc-50/75 backdrop-blur-lg md:pt-16">
          {activeCategory || category ? <CategoryView /> : <Overview />}
        </div>
      </div>
    </ContentLayout>
  );
};
