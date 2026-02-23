import { createRootRoute, Outlet } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import { z } from 'zod';

import { MaintenancePage } from '@/app/maintenance-page';
import { MainErrorFallback } from '@/components/errors/main';
import { Button } from '@/components/ui/button';
import { Body1, H1 } from '@/components/ui/typography';
import { env } from '@/config/env';
import { ProtectedRoute } from '@/lib/auth';
import { useShouldBypassMaintenance } from '@/utils/maintenance-bypass';

const rootSearchSchema = z.object({
  code: z.string().trim().optional().catch(undefined),
  invite: z.string().trim().optional().catch(undefined),
  bypass: z.string().trim().optional().catch(undefined),
});

export const Route = createRootRoute({
  validateSearch: zodValidator(rootSearchSchema),
  component: RootComponent,
  errorComponent: MainErrorFallback,
  notFoundComponent: NotFoundComponent,
});

function RootComponent() {
  const shouldBypassMaintenance = useShouldBypassMaintenance();

  if (env.MAINTENANCE_MODE && !shouldBypassMaintenance) {
    return <MaintenancePage />;
  }

  return <Outlet />;
}

function NotFoundComponent() {
  return (
    <ProtectedRoute>
      <div
        className="flex h-screen w-full flex-col items-center justify-center gap-7 p-4"
        role="alert"
      >
        <img src="/logo-dark.svg" className="h-auto w-32" alt="logo" />
        <div className="max-w-md space-y-4">
          <H1 className="text-center !text-5xl">Page not found.</H1>
          <Body1 className="text-balance text-center text-zinc-500">
            Sorry, even our superpowers can’t locate this page or the page you
            are looking for no longer exists
          </Body1>
        </div>
        <Button
          className="mt-4"
          variant="outline"
          onClick={() => window.location.assign(window.location.origin)}
        >
          Refresh
        </Button>
      </div>
    </ProtectedRoute>
  );
}
