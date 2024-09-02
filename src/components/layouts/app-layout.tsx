import { useState } from 'react';

import { Sidebar } from '@/components/ui/sidebar/sidebar';
import { useUser } from '@/lib/auth';
import { cn } from '@/lib/utils';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { data } = useUser();
  /*
   * Completely hides sidebar from UI.
   *
   * */
  const hideNavBar = !data || data?.onboarding?.status === 'INCOMPLETE';

  const [open, setOpen] = useState(false);

  return (
    <>
      <main
        id="app"
        className={cn(
          'flex flex-col-reverse sm:flex-row  bg-white w-full ',
          'min-h-screen', // for your use case, use `h-screen` instead of `h-[60vh]`
        )}
      >
        {!hideNavBar && <Sidebar open={open} setOpen={setOpen} />}
        <div className={cn('flex-1', !hideNavBar ? 'md:ml-[88px]' : null)}>
          {children}
        </div>
      </main>
    </>
  );
}
