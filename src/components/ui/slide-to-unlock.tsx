import { LucideArrowRight } from 'lucide-react';
import { useRef, useCallback } from 'react';

import { cn } from '@/lib/utils';

interface SlideToUnlockProps {
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  onComplete: () => void;
  onProgress?: (progress: number) => void;
}

export const SlideToUnlock = ({
  className = '',
  disabled = false,
  children,
  onComplete,
  onProgress,
}: SlideToUnlockProps) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startPositionRef = useRef(0);
  const currentTranslateRef = useRef(0);
  const shrinkingContainerRef = useRef<HTMLDivElement>(null);

  const handleStart = useCallback(
    (clientX: number) => {
      if (!sliderRef.current || !containerRef.current || disabled) return;

      isDraggingRef.current = true;
      startPositionRef.current = clientX;

      if (sliderRef.current) {
        sliderRef.current.style.cursor = 'grabbing';
        sliderRef.current.style.transition = 'none';
      }

      if (shrinkingContainerRef.current) {
        shrinkingContainerRef.current.style.transition = 'none';
      }
    },
    [disabled],
  );

  const handleMove = useCallback(
    (clientX: number) => {
      if (
        !isDraggingRef.current ||
        !sliderRef.current ||
        !containerRef.current ||
        !shrinkingContainerRef.current ||
        disabled
      )
        return;

      const deltaX = clientX - startPositionRef.current;
      const containerWidth = containerRef.current.offsetWidth;
      const sliderWidth = sliderRef.current.offsetWidth;
      const maxTranslate = containerWidth - sliderWidth - 18;

      let newTranslate = currentTranslateRef.current + deltaX;
      newTranslate = Math.max(0, Math.min(newTranslate, maxTranslate));

      sliderRef.current.style.transform = `translateX(${newTranslate}px)`;
      shrinkingContainerRef.current.style.maxWidth = `${containerWidth - newTranslate}px`;

      const progress = maxTranslate > 0 ? newTranslate / maxTranslate : 0;
      onProgress?.(progress);

      if (newTranslate === maxTranslate) {
        onComplete();
      }
    },
    [disabled, onComplete, onProgress],
  );

  const handleEnd = useCallback(() => {
    if (
      !isDraggingRef.current ||
      !sliderRef.current ||
      !containerRef.current ||
      !shrinkingContainerRef.current ||
      disabled
    )
      return;

    isDraggingRef.current = false;

    const containerWidth = containerRef.current.offsetWidth;
    const sliderWidth = sliderRef.current.offsetWidth;
    const maxTranslate = containerWidth - sliderWidth;

    const currentTransform = sliderRef.current.style.transform;
    const currentTranslate = currentTransform
      ? parseFloat(
          currentTransform.replace('translateX(', '').replace('px)', ''),
        )
      : 0;

    currentTranslateRef.current = currentTranslate;

    if (currentTranslate < maxTranslate) {
      sliderRef.current.style.transition = 'transform 0.3s ease-in-out';
      sliderRef.current.style.transform = 'translateX(0px)';
      currentTranslateRef.current = 0;
      shrinkingContainerRef.current.style.maxWidth = '100%';
      shrinkingContainerRef.current.style.transition =
        'max-width 0.3s ease-in-out';

      onProgress?.(0);
    }

    sliderRef.current.style.cursor = 'grab';
  }, [disabled, onProgress]);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (disabled) return;
      e.preventDefault();
      handleStart(e.clientX);

      const onMouseMove = (e: MouseEvent) => handleMove(e.clientX);
      const onMouseUp = () => {
        handleEnd();
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
    [handleStart, handleMove, handleEnd, disabled],
  );

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (disabled) return;
      handleStart(e.touches[0].clientX);

      const onTouchMove = (e: TouchEvent) => {
        e.preventDefault();
        handleMove(e.touches[0].clientX);
      };
      const onTouchEnd = () => {
        handleEnd();
        document.removeEventListener('touchmove', onTouchMove);
        document.removeEventListener('touchend', onTouchEnd);
      };

      document.addEventListener('touchmove', onTouchMove, { passive: false });
      document.addEventListener('touchend', onTouchEnd);
    },
    [handleStart, handleMove, handleEnd, disabled],
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onComplete();
      }
    },
    [onComplete, disabled],
  );

  return (
    <div ref={containerRef} className="relative ml-auto flex size-full">
      <div
        ref={shrinkingContainerRef}
        className={cn(
          className,
          'absolute inset-0 left-auto w-full overflow-hidden transition-all',
        )}
      >
        {children && <div className="absolute inset-0 z-10">{children}</div>}
      </div>
      <div
        ref={sliderRef}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="Slide to unlock"
        className="relative top-2 z-20 ml-2.5 flex aspect-square h-[calc(100%-1rem)] cursor-grab touch-manipulation select-none items-center justify-center rounded-full border border-zinc-200 bg-white transition-all hover:bg-zinc-50 active:scale-[.98]"
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onKeyDown={onKeyDown}
      >
        <LucideArrowRight className="size-6 touch-manipulation" />
      </div>
    </div>
  );
};
