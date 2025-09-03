import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface UseInViewOptions {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useInView<T extends HTMLElement = HTMLElement>(
  options: UseInViewOptions = {},
) {
  const { threshold = 0.1, rootMargin = '0px', triggerOnce = false } = options;

  const [isInView, setIsInView] = useState(false);
  const elementRef = useRef<T | null>(null);
  const hasTriggered = useRef(false);

  const observerOptions = useMemo(
    () => ({
      threshold,
      rootMargin,
      root: null,
    }),
    [threshold, rootMargin],
  );

  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        const inView = entry.isIntersecting;

        if (triggerOnce && hasTriggered.current && !inView) {
          return;
        }

        if (inView && triggerOnce) {
          hasTriggered.current = true;
        }

        setIsInView(inView);

        if (triggerOnce && inView && observerRef.current) {
          observerRef.current.unobserve(entry.target);
        }
      });
    },
    [triggerOnce],
  );

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      handleIntersection,
      observerOptions,
    );
    observerRef.current = observer;

    observer.observe(element);

    return () => {
      observer.disconnect();
      observerRef.current = null;
    };
  }, [observerOptions, handleIntersection]);

  return { isInView, ref: elementRef };
}
