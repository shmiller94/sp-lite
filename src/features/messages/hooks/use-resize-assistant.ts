import { useCallback, useEffect, useMemo, useState } from 'react';

import { useWindowDimensions } from '@/hooks/use-window-dimensions';

type Size = {
  width: number;
  height: number;
};

const MOBILE_BREAKPOINT = 1024;
const DEFAULT_DESKTOP_WIDTH = 600;
const DEFAULT_MIN_HEIGHT = 240;
const DEFAULT_MIN_WIDTH = 320;

export function getDefaultAssistantSize(): { width: number; height: number } {
  if (typeof window === 'undefined') {
    return { width: DEFAULT_DESKTOP_WIDTH, height: 512 };
  }

  const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
  const initialHeight = Math.max(512, Math.round(window.innerHeight * 0.75));
  const initialWidth = isMobile
    ? Math.max(DEFAULT_MIN_WIDTH, Math.round(window.innerWidth - 32)) // mimic w-[calc(100vw-2rem)]
    : DEFAULT_DESKTOP_WIDTH;

  return { width: initialWidth, height: initialHeight };
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
}

export function useResizeAssistant() {
  const initialSize: Size = useMemo(() => getDefaultAssistantSize(), []);

  const [size, setSize] = useState<Size>(initialSize);

  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const constraints = useMemo(() => {
    if (typeof window === 'undefined') {
      return {
        min: { width: DEFAULT_MIN_WIDTH, height: DEFAULT_MIN_HEIGHT },
        max: { width: 1024, height: 1024 },
      };
    }
    const maxWidth = Math.max(DEFAULT_MIN_WIDTH, Math.round(windowWidth - 32));
    const maxHeight = Math.max(
      DEFAULT_MIN_HEIGHT,
      Math.round(windowHeight - 96),
    );
    return {
      min: { width: DEFAULT_MIN_WIDTH, height: DEFAULT_MIN_HEIGHT },
      max: { width: maxWidth, height: maxHeight },
    };
  }, [windowWidth, windowHeight]);

  useEffect(() => {
    const maxWidth = Math.max(DEFAULT_MIN_WIDTH, Math.round(windowWidth - 32));
    const maxHeight = Math.max(
      DEFAULT_MIN_HEIGHT,
      Math.round(windowHeight - 32),
    );
    setSize((prev) => ({
      width: clamp(prev.width, DEFAULT_MIN_WIDTH, maxWidth),
      height: clamp(prev.height, DEFAULT_MIN_HEIGHT, maxHeight),
    }));
  }, [windowWidth, windowHeight]);

  const setWidth = useCallback((width: number) => {
    setSize((prev) => ({ ...prev, width }));
  }, []);

  const setHeight = useCallback((height: number) => {
    setSize((prev) => ({ ...prev, height }));
  }, []);

  return {
    width: size.width,
    height: size.height,
    // expose atomic size update to avoid width/height race conditions
    setSize,
    setWidth,
    setHeight,
    minConstraints: [constraints.min.width, constraints.min.height] as const,
    maxConstraints: [constraints.max.width, constraints.max.height] as const,
  };
}
