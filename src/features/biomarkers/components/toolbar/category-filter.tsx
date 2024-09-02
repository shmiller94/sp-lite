import { Column } from '@tanstack/react-table';
import { Check, ChevronDown } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CATEGORY_OPTIONS } from '@/features/biomarkers/const/toolbar-options';
import { cn } from '@/lib/utils';

interface DataTableFacetedFilter<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: React.ReactNode;
}

export function CategoryFilter<TData, TValue>({
  column,
}: DataTableFacetedFilter<TData, TValue>): JSX.Element {
  const selectedValues = new Set(column?.getFilterValue() as string[]);

  const title = 'Category';

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            'bg-white rounded-lg py-2 px-3 text-sm text-zinc-500 flex items-center gap-x-1.5 light',
            selectedValues.size > 0 ? 'border-vermillion-700' : 'border-none',
          )}
        >
          <p className="hidden whitespace-nowrap sm:block">
            {selectedValues.size > 0 ? (
              <div className="flex flex-row items-center gap-x-1.5">
                <span className="size-4 rounded-full bg-vermillion-700 text-center text-xs text-white">
                  {selectedValues.size}
                </span>
                <span>Categories</span>
              </div>
            ) : (
              title
            )}
          </p>
          <ChevronDown className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="min-w-[456px] rounded-xl border-0 bg-white p-4 text-sm shadow"
        align="end"
        side="bottom"
      >
        <div className="flex flex-col gap-y-4">
          <div className="flex flex-row items-center justify-between">
            <div>Categories</div>
            <div>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-sm text-gray-400 hover:bg-transparent"
                onClick={() => {
                  selectedValues.clear();
                  column?.setFilterValue(undefined);
                }}
              >
                Clear Selection
              </Button>
            </div>
          </div>
          <div className="grid gap-x-6 gap-y-2.5 md:grid-cols-2">
            {CATEGORY_OPTIONS.map((option) => {
              const isSelected = selectedValues.has(option.value);
              return (
                <div
                  key={option.value}
                  role="presentation"
                  onClick={() => {
                    if (isSelected) {
                      selectedValues.delete(option.value);
                    } else {
                      selectedValues.add(option.value);
                    }
                    const filterValues = Array.from(selectedValues);
                    column?.setFilterValue(
                      filterValues.length ? filterValues : undefined,
                    );
                  }}
                  className="my-1 ml-1 mr-2 flex w-full max-w-[200px] cursor-pointer flex-row items-center gap-x-2 truncate"
                >
                  <div
                    className={cn(
                      'flex h-5 w-5 items-center justify-center rounded-sm bg-[#F8FAFC]',
                      isSelected
                        ? 'text-primary-foreground bg-vermillion-100 text-vermillion-700'
                        : '[&_svg]:invisible',
                    )}
                  >
                    <Check className={cn('h-4 w-4')} />
                  </div>
                  <span className="text-gray-500">{option.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default CategoryFilter;
