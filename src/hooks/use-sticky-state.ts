import { useEffect, useRef, useState } from 'react';

/**
 * A hook that tracks the intersection of an element with the viewport.
 * @returns {Object} An object containing the intersection state and a ref to the sentinel element.
 */
export const useIsIntersecting = () => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const checkPosition = () => {
      const rect = sentinel.getBoundingClientRect();
      const threshold = 50;

      if (rect.bottom < -threshold) {
        setIsIntersecting(true);
      } else if (rect.bottom > threshold) {
        setIsIntersecting(false);
      }
    };

    checkPosition();

    const handleScroll = () => {
      checkPosition();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return { isIntersecting, sentinelRef };
};
