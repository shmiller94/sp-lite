import { type DependencyList, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

type UseProgressiveRevealOptions = {
  totalCount: number;
  pageSize: number;
  resetDeps?: DependencyList;
  rootMargin?: string;
};

export const useProgressiveReveal = ({
  totalCount,
  pageSize,
  resetDeps = [],
  rootMargin = '200px',
}: UseProgressiveRevealOptions) => {
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const { ref, inView } = useInView({
    rootMargin,
  });

  useEffect(() => {
    setVisibleCount(pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, ...resetDeps]);

  const hasMore = visibleCount < totalCount;

  useEffect(() => {
    if (!inView || !hasMore) return;
    setVisibleCount((count) => Math.min(count + pageSize, totalCount));
  }, [hasMore, inView, pageSize, totalCount]);

  return {
    visibleCount,
    hasMore,
    sentinelRef: ref,
  };
};
