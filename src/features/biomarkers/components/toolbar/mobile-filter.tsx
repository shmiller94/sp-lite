import { Column } from '@tanstack/react-table';
import { Check, Circle, SlidersHorizontal } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui/drawer';
import {
  CATEGORY_OPTIONS,
  STATUS_OPTIONS,
} from '@/features/biomarkers/const/toolbar-options';
import { cn } from '@/lib/utils';

interface MobileFilterProps<TData, TValue> {
  categoryColumn?: Column<TData, TValue>;
  statusColumn?: Column<TData, TValue>;
}

export function MobileFilter<TData, TValue>({
  statusColumn,
  categoryColumn,
}: MobileFilterProps<TData, TValue>): JSX.Element {
  const selectedCategory = new Set(
    categoryColumn?.getFilterValue() as string[],
  );
  const selectedStatus = new Set(statusColumn?.getFilterValue() as string[]);

  const allRangesStatusOption = STATUS_OPTIONS.find((o) => o.value === '');

  return (
    <Drawer>
      <DrawerTrigger>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            'bg-white rounded-lg py-2 px-3 text-sm text-zinc-500 flex items-center gap-x-1.5',
          )}
        >
          {selectedStatus.size + selectedCategory.size > 0 && (
            <span className="mr-1">
              {selectedStatus.size + selectedCategory.size}
            </span>
          )}
          <SlidersHorizontal className="size-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="inset-x-0 bottom-0 h-full max-h-[96%] rounded-none bg-white">
        <DrawerHeader>
          <div className="mb-4 mt-8 text-center">
            <h2>Biomarker Filters</h2>
          </div>
          <hr className="border-slate-100" />
        </DrawerHeader>
        <div className="overflow-y-auto bg-white px-6 pb-8">
          <div className="mb-4 flex flex-row items-center justify-between">
            <div className="text-3xl">Ranges</div>
            <div>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-sm text-gray-400 hover:bg-transparent"
                onClick={() => {
                  selectedStatus.clear();
                  statusColumn?.setFilterValue(undefined);
                }}
              >
                Clear selection
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-y-1">
            {STATUS_OPTIONS.map((option) => {
              const isSelected =
                selectedStatus.has(option.value) ||
                (selectedStatus.size === 0 &&
                  option.value === allRangesStatusOption?.value);
              return (
                <div
                  role="presentation"
                  key={option.value}
                  onClick={() => {
                    selectedStatus.clear();
                    selectedStatus.add(option.value);

                    const filterValues = Array.from(selectedStatus);
                    statusColumn?.setFilterValue(
                      filterValues.length &&
                        option.value !== allRangesStatusOption?.value
                        ? filterValues
                        : undefined,
                    );
                  }}
                  className="my-1 ml-1 mr-2 flex w-full cursor-pointer flex-row gap-x-2 rounded-lg p-1.5 hover:bg-slate-50"
                >
                  <div
                    className={cn(
                      `h-4 w-4 rounded-full border border-${option.color} mt-1 flex items-center justify-center`,
                      isSelected
                        ? `text-primary-foreground`
                        : '[&_svg]:invisible',
                    )}
                  >
                    <Circle
                      className={cn(`h-3 w-3 fill-${option.color}`)}
                      strokeWidth={0}
                    />
                  </div>
                  <div className="flex flex-col gap-y-1.5 text-gray-500">
                    <span className="">{option.label}</span>
                    <span className="text-sm text-gray-400">
                      {option.description}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <hr className="my-8 border-slate-100" />
          <div className="mb-4 flex flex-row items-center justify-between">
            <div className="text-3xl">Categories</div>
            <div>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-sm text-gray-400 hover:bg-transparent"
                onClick={() => {
                  selectedCategory.clear();
                  categoryColumn?.setFilterValue(undefined);
                }}
              >
                Clear selection
              </Button>
            </div>
          </div>
          <div className="grid gap-x-6 gap-y-2.5 md:grid-cols-2">
            {CATEGORY_OPTIONS.map((option) => {
              const isSelected = selectedCategory.has(option.value);
              return (
                <div
                  key={option.value}
                  role="presentation"
                  onClick={() => {
                    if (isSelected) {
                      selectedCategory.delete(option.value);
                    } else {
                      selectedCategory.add(option.value);
                    }
                    const filterValues = Array.from(selectedCategory);
                    categoryColumn?.setFilterValue(
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
        <DrawerFooter
          className="bg-white"
          style={{
            boxShadow:
              '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 13px 10px rgb(0 0 0 / 0.1)',
          }}
        >
          <DrawerClose>
            <Button variant="default" className="w-full bg-black text-white">
              Filter Biomarkers
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default MobileFilter;
