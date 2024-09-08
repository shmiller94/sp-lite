import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useLocation, useNavigation } from 'react-router-dom';

import { Sidebar } from '@/components/shared/sidebar';
import { useUser } from '@/lib/auth';
import { cn } from '@/lib/utils';

const Progress = () => {
  const { state, location } = useNavigation();

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);
  }, [location?.pathname]);

  useEffect(() => {
    if (state === 'loading') {
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
  }, [state]);

  if (state !== 'loading') {
    return null;
  }

  return (
    <div
      className="fixed left-0 top-0 h-1 bg-vermillion-900 transition-all duration-200 ease-in-out"
      style={{ width: `${progress}%` }}
    ></div>
  );
};

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { data } = useUser();
  const { pathname } = useLocation();
  /*
   * Completely hides sidebar from UI.
   *
   * */
  const hideNavBar =
    !data ||
    data?.onboarding?.status === 'INCOMPLETE' ||
    pathname.includes('plans');

  const [open, setOpen] = useState(true);

  return (
    <>
      {!hideNavBar && <Sidebar open={open} setOpen={setOpen} />}
      <motion.div
        className={cn(
          'flex flex-col',
          !hideNavBar
            ? 'mb-[72px] md:mb-0 min-h-[calc(100dvh-72px)] md:min-h-dvh'
            : 'min-h-screen',
          open && !hideNavBar
            ? 'md:ml-[196px] md:max-w-[calc(100dvw-196px]'
            : null,
          !open && !hideNavBar
            ? 'md:ml-[88px] md:max-w-[calc(100dvw-88px]'
            : null,
        )}
      >
        <Progress />
        {children}
      </motion.div>
    </>
  );
}
