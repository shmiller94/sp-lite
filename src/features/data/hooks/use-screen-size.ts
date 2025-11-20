import { useSyncExternalStore } from 'react';

const QUERIES = [
  { name: 'mobile', query: '(max-width: 1023px)' },
  { name: 'tablet', query: '(max-width: 1279px)' },
  { name: 'desktop', query: '(max-width: 1600px)' },
] as const;

export type ScreenSize = (typeof QUERIES)[number]['name'] | 'widescreen';

function getSize(): ScreenSize {
  if (
    typeof window === 'undefined' ||
    typeof window.matchMedia === 'undefined'
  ) {
    return 'desktop';
  }

  for (const { name, query } of QUERIES) {
    if (window.matchMedia(query).matches) {
      return name;
    }
  }
  return 'widescreen';
}

function subscribe(callback: () => void) {
  if (
    typeof window === 'undefined' ||
    typeof window.matchMedia === 'undefined'
  ) {
    return () => {};
  }

  const mediaQueries = QUERIES.map(({ query }) => window.matchMedia(query));
  let rafId: number | null = null;

  const handler = () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
    }
    rafId = requestAnimationFrame(() => {
      callback();
      rafId = null;
    });
  };

  mediaQueries.forEach((mq) => mq.addEventListener('change', handler));

  return () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
    }
    mediaQueries.forEach((mq) => mq.removeEventListener('change', handler));
  };
}

export function useScreenSize(): ScreenSize {
  return useSyncExternalStore(subscribe, getSize, () => 'desktop');
}
