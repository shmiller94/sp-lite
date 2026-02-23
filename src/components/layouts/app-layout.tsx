import { useRouterState } from '@tanstack/react-router';
import type React from 'react';

import { DevHelper } from '@/components/shared/dev-helper';
import { FloatingWrapper } from '@/components/shared/floating-wrapper';
import { NavigationProgress } from '@/components/ui/navigation-progress';
import { WHITE_BACKGROUND_PATHS } from '@/const/white-background-paths';
import { Announcements } from '@/features/announcements/components/announcements';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useUser } from '@/lib/auth';
import { cn } from '@/lib/utils';

import { Navbar } from '../shared/navbar';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { data } = useUser();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isDev = import.meta.env.DEV;

  // matches theme colors
  useThemeColor();

  /*
   * Completely hides navbar from UI.
   *
   * */
  const hideNavBar =
    !data ||
    pathname.includes('onboarding') ||
    pathname.includes('questionnaire') ||
    pathname.includes('family-risk/plan') ||
    pathname.includes('schedule') ||
    pathname.includes('intake');

  let isWhiteBg = false;
  for (const path of WHITE_BACKGROUND_PATHS) {
    if (pathname.includes(path)) {
      isWhiteBg = true;
      break;
    }
  }

  return (
    <main className={isWhiteBg ? 'bg-white' : 'bg-zinc-50'}>
      {isDev ? <DevHelper /> : null}
      {!hideNavBar && <Navbar />}
      <NavigationProgress />
      <div
        className={cn(
          'flex flex-1 flex-col',
          !hideNavBar
            ? 'mb-[72px] min-h-[calc(100dvh-72px)] md:mb-0 md:min-h-[calc(100dvh-68px)]'
            : null,
        )}
      >
        {children}
      </div>
      <FloatingWrapper />
      <Announcements />
    </main>
  );
}
