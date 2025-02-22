import { MaintenancePage } from '@/components/layouts/maintenance-page';
import { env } from '@/config/env';

import { AppProvider } from './provider';
import { AppRouter } from './router';

export const App = () => {
  if (env.MAINTENANCE_MODE) {
    return <MaintenancePage />;
  }

  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
};
