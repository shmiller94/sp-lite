import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Link } from '@/components/ui/link';
import { Skeleton } from '@/components/ui/skeleton';
import { H3 } from '@/components/ui/typography';
import { useBiomarkers } from '@/features/data/api';
import { useWindowDimensions } from '@/hooks/use-window-dimensions';
import { cn } from '@/lib/utils';

import { useCategories } from '../../api/get-categories';
import { useDataFilterStore } from '../../stores/data-filter-store';
import { encodeCategory } from '../../utils/category/encode-category';

import { DataSidebarLink } from './data-sidebar-link';

const PureDataSidebar = () => {
  const { width } = useWindowDimensions();
  const isMobile = useMemo(() => width < 1024, [width]);

  const [isOpen, setIsOpen] = useState(false);
  const selectorRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafIdRef = useRef<number | null>(null);
  const previousActiveCategoryRef = useRef<string | null>(null);

  const [searchParams] = useSearchParams();
  const { data: categories, isLoading: isCategoriesLoading } = useCategories();

  const activeCategory = searchParams.get('category');

  const { updateCategories, clearCategories } = useDataFilterStore();

  const { isLoading: isBiomarkersLoading } = useBiomarkers();

  const isLoading = isCategoriesLoading || isBiomarkersLoading;

  const updateCategoryFilter = useCallback(
    (category: string | null) => {
      if (category) {
        updateCategories([category]);
      } else {
        clearCategories();
      }
    },
    [updateCategories, clearCategories],
  );

  useEffect(() => {
    if (isLoading) return;

    if (previousActiveCategoryRef.current !== activeCategory) {
      updateCategoryFilter(activeCategory);
      previousActiveCategoryRef.current = activeCategory;
    }
  }, [activeCategory, isLoading, updateCategoryFilter]);

  const repositionSelector = useCallback(() => {
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    rafIdRef.current = requestAnimationFrame(() => {
      const selector = selectorRef.current;
      const activeCategoryElement = document.getElementById(
        `selector-${activeCategory?.toLowerCase() ?? 'summary'}`,
      );

      if (activeCategoryElement && selector) {
        selector.style.setProperty(
          'transform',
          `translateY(${activeCategoryElement.offsetTop}px) translateX(${activeCategoryElement.offsetLeft - 8}px)`,
        );
        selector.style.setProperty(
          'width',
          `${activeCategoryElement.offsetWidth}px`,
        );
      }
    });
  }, [activeCategory]);

  useEffect(() => {
    repositionSelector();
  }, [activeCategory, isLoading, isOpen, repositionSelector]);

  useEffect(() => {
    if (!isMobile && isOpen) {
      setIsOpen(false);
      document.body.style.overflow = 'auto';
    }
  }, [isMobile, isOpen]);

  const toggleSidebar = useCallback(() => {
    setIsOpen((prev) => {
      const newIsOpen = !prev;

      if (newIsOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }

      return newIsOpen;
    });
  }, []);

  const categoriesContent = useMemo(() => {
    if (isLoading) {
      return Array.from({ length: 17 }).map((_, index) => (
        <Skeleton
          key={index}
          className="h-6 shrink-0 rounded-full"
          style={{
            width: `${Math.max(96, Math.random() * 128)}px`,
          }}
          variant="shimmer"
        />
      ));
    }

    const items = [] as JSX.Element[];

    items.push(
      <DataSidebarLink
        key="overview"
        category={{
          category: 'Summary',
          value: '-',
        }}
        isActive={activeCategory === null}
      />,
    );

    if (!categories?.categories) return [];

    categories?.categories.forEach((category) => {
      const isActive =
        encodeCategory(category.category) ===
        encodeCategory(activeCategory ?? '');

      items.push(
        <DataSidebarLink
          key={category.category}
          category={category}
          isActive={isActive}
        />,
      );
    });

    return items;
  }, [isLoading, activeCategory, categories?.categories]);

  return (
    <aside className="col-span-1 flex flex-col">
      <div className="relative z-30 mb-4 flex gap-4 bg-zinc-50/20 backdrop-blur-lg lg:sticky lg:top-16 lg:mb-0">
        <Link to="/data">
          <H3>Twin</H3>
        </Link>
        <Link to="/data/records" className="border-b-2 border-b-transparent">
          <H3 className="text-black/20 transition-all hover:text-black/40">
            Records
          </H3>
        </Link>
      </div>

      <div className="flex lg:hidden">
        <button
          onClick={toggleSidebar}
          className="relative z-10 flex shrink-0 items-center gap-2 rounded-full border border-zinc-100 bg-white px-3 py-1.5 shadow-md shadow-black/[.03]"
        >
          <div className="relative h-3 w-3.5">
            <div
              className={cn(
                'absolute left-0 top-0 h-0.5 w-full rounded-full bg-zinc-400 transition-all duration-300 ease-out',
                isOpen && 'top-1',
              )}
            />
            <div
              className={cn(
                'absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 rounded-full bg-zinc-400 transition-all duration-300 ease-out',
                isOpen && 'opacity-0',
              )}
            />
            <div
              className={cn(
                'absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-zinc-400 transition-all duration-300 ease-out',
                isOpen && 'bottom-1',
              )}
            />
          </div>
          Health Categories
        </button>
      </div>

      <div
        onClick={isMobile ? toggleSidebar : undefined}
        role={isMobile ? 'button' : ''}
        tabIndex={isMobile ? 0 : undefined}
        onKeyDown={(e) => {
          if (isMobile && (e.key === 'Enter' || e.key === ' ')) {
            toggleSidebar();
          }
        }}
        className={cn(
          'flex items-center px-4 transition-all z-[51]',
          'fixed inset-0 top-20',
          // On desktop ensure the sidebar can overflow and sit above neighbors
          'lg:sticky lg:inset-auto lg:top-28 lg:px-0 lg:pt-0 lg:z-20 lg:my-4 lg:max-w-none lg:-translate-y-3',
          isOpen
            ? 'top-0 w-screen h-screen bg-white/80 backdrop-blur-sm lg:block lg:backdrop-blur-none lg:bg-none'
            : 'opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto lg:h-auto lg:bg-none',
        )}
      >
        <div
          ref={containerRef}
          className="relative -ml-2 flex max-h-svh w-full flex-col place-items-start items-start justify-start gap-3 overflow-y-auto overflow-x-visible px-2 py-12 scrollbar scrollbar-track-transparent scrollbar-thumb-zinc-300 lg:max-h-none lg:overflow-visible lg:px-2 lg:py-8"
        >
          {!isLoading && (
            <div
              ref={selectorRef}
              className={cn(
                'pointer-events-none absolute top-0 translate-y-8 h-full w-full max-h-[30px] rounded-full transition-all duration-300 ease-out',
                isLoading && 'opacity-0',
              )}
            >
              <div
                key={activeCategory}
                className="max-lg:animate-grow-shrink-horizontal lg:animate-grow-shrink-vertical h-full rounded-full border border-zinc-200 bg-white shadow-md shadow-black/5"
              />
            </div>
          )}

          {categoriesContent}
        </div>
      </div>
    </aside>
  );
};

export const DataSidebar = memo(PureDataSidebar);
