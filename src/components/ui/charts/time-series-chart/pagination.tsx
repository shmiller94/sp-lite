import React from 'react';

import { ChevronLeft } from '@/components/icons/chevron-left-icon';
import { ChevronRightIcon } from '@/components/icons/chevron-right-icon';
import { Button } from '@/components/ui/button/button';

interface PaginationProps {
  currentPage: number;
  totalPages?: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPreviousPage,
  onNextPage,
  className = '',
}) => {
  const isPreviousDisabled = !totalPages || currentPage === totalPages - 1;
  const isNextDisabled = currentPage === 0;

  const handleButtonTouch = (e: React.TouchEvent, callback: () => void) => {
    e.stopPropagation();
    if (!e.defaultPrevented) {
      callback();
    }
  };

  const handleButtonClick = (e: React.MouseEvent, callback: () => void) => {
    e.stopPropagation();
    callback();
  };

  return (
    <div
      className={`flex w-full select-none justify-between gap-2 ${className}`}
    >
      <Button
        size="icon"
        variant="ghost"
        onClick={(e) => handleButtonClick(e, onPreviousPage)}
        onTouchEnd={(e) => handleButtonTouch(e, onPreviousPage)}
        disabled={isPreviousDisabled}
        className={`size-8 touch-manipulation rounded-lg bg-zinc-100 p-0 transition-transform hover:bg-zinc-200 active:scale-95 disabled:cursor-not-allowed ${
          isPreviousDisabled ? 'opacity-50' : 'opacity-100'
        }`}
        aria-label="Previous page"
      >
        <ChevronLeft
          className={`size-4 ${
            isPreviousDisabled ? 'text-gray-400' : 'text-gray-700'
          }`}
          strokeWidth={2.5}
        />
      </Button>

      <Button
        size="icon"
        variant="ghost"
        onClick={(e) => handleButtonClick(e, onNextPage)}
        onTouchEnd={(e) => handleButtonTouch(e, onNextPage)}
        disabled={isNextDisabled}
        className={`size-8 touch-manipulation rounded-lg bg-zinc-100 p-0 transition-transform hover:bg-zinc-200 active:scale-95 disabled:cursor-not-allowed ${
          isNextDisabled ? 'opacity-50' : 'opacity-100'
        }`}
        aria-label="Next page"
      >
        <ChevronRightIcon
          className={`size-4 ${
            isNextDisabled ? 'text-gray-400' : 'text-gray-700'
          }`}
          strokeWidth={2.5}
        />
      </Button>
    </div>
  );
};
