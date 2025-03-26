import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

import { NavigationProgress } from '@/components/ui/navigation-progress';
import { useUser } from '@/lib/auth';
import { cn } from '@/lib/utils';

import { Navbar } from '../shared/navbar';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { data } = useUser();
  const { pathname } = useLocation();
  /*
   * Completely hides sidebar from UI.
   *
   * */
  const hideNavBar =
    !data || pathname.includes('onboarding') || pathname.includes('plans');

  const whiteBgPaths = ['services', 'members', 'upcoming'];
  const isWhiteBg =
    whiteBgPaths.some((path) => pathname.includes(path)) || pathname === '/';

  return (
    <main>
      {!hideNavBar && <Navbar />}
      <NavigationProgress />
      <motion.div
        className={cn(
          'flex flex-col flex-1 md:pt-24',
          isWhiteBg ? 'bg-white' : 'bg-zinc-50',
          !hideNavBar
            ? 'mb-[72px] md:mb-0 min-h-[calc(100dvh-72px)] md:min-h-dvh'
            : null,
        )}
      >
        {children}
      </motion.div>
    </main>
  );
}
