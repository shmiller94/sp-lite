import { useRouterState } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

export const NavigationProgress = () => {
  const status = useRouterState({ select: (s) => s.status });
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setProgress(0);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [pathname]);

  useEffect(() => {
    if (status === 'pending') {
      const timer = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress === 100) {
            clearInterval(timer);
            return 100;
          }
          const newProgress = oldProgress + 10;
          return newProgress > 100 ? 100 : newProgress;
        });
      }, 300);

      return () => {
        clearInterval(timer);
      };
    }
  }, [status]);

  if (status !== 'pending') {
    return null;
  }

  return (
    <div
      className="fixed left-0 top-0 h-1 bg-vermillion-900 transition-all duration-200 ease-in-out"
      style={{ width: `${progress}%` }}
    ></div>
  );
};
