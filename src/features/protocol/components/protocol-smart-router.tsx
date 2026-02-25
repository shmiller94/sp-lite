import { Skeleton } from '@/components/ui/skeleton';

import { useLatestProtocol, useLegacyLatestProtocol } from '../api';

import { LegacyProtocolDashboard } from './dashboard/legacy/protocol-dashboard-legacy';
import { ProtocolDashboard } from './dashboard/protocol-dashboard';
import { ProtocolWaitingScreen } from './protocol-waiting-screen';

/**
 * Smart router that determines which protocol dashboard to show
 * based on whether the user has a legacy or SP2 protocol
 */
export const ProtocolSmartRouter = () => {
  const { data: legacyData, isLoading: legacyLoading } =
    useLegacyLatestProtocol();
  const { data: sp2Data, isLoading: sp2Loading } = useLatestProtocol();

  if (legacyLoading || sp2Loading) {
    return (
      <div className="mx-auto h-screen w-full max-w-[800px] space-y-6 p-6 lg:px-16">
        <Skeleton className="h-8 w-32 rounded-xl" />
        <Skeleton className="h-12 w-48 rounded-2xl" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="size-6 rounded-[6px]" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-16 w-full rounded-2xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const hasLegacy = !!legacyData;
  const hasSP2 = !!sp2Data?.protocol;

  // Prefer new protocol if available
  if (hasSP2) {
    return <ProtocolDashboard />;
  }

  // Fall back to legacy if available
  if (hasLegacy) {
    return <LegacyProtocolDashboard />;
  }

  // No protocol available
  return <ProtocolWaitingScreen />;
};
