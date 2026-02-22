import { useEffect, useState } from 'react';

const INITIAL_NOW_MS = Date.now();

export function useNowMs(intervalMs = 60_000) {
  const [nowMs, setNowMs] = useState(INITIAL_NOW_MS);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setNowMs(Date.now());
    }, 0);

    if (intervalMs <= 0) {
      return () => {
        clearTimeout(timeoutId);
      };
    }

    const intervalId = setInterval(() => {
      setNowMs(Date.now());
    }, intervalMs);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [intervalMs]);

  return nowMs;
}
