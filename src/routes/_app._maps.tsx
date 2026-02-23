import { createFileRoute, Outlet } from '@tanstack/react-router';
import { APIProvider } from '@vis.gl/react-google-maps';

import { env } from '@/config/env';

export const Route = createFileRoute('/_app/_maps')({
  component: () => (
    <APIProvider apiKey={env.GOOGLE_API_KEY} libraries={['places']}>
      <Outlet />
    </APIProvider>
  ),
});
