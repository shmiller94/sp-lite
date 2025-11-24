import { useMemo, useState } from 'react';

import { useAuthorization } from '@/lib/authorization';

import { useNeedsMembershipConsent } from '../hooks/use-needs-membership-consent';
import { useNeedsPhiMarketingConsent } from '../hooks/use-needs-phi-marketing-consent';

import { ConsentDialog } from './modals/consent-dialog';
import { PhiConsentDialog } from './modals/phi-consent-dialog';

type QueueItem = {
  key: string;
  required: boolean;
  render: (advance: () => void) => JSX.Element | null;
};

export const Announcements = () => {
  const isAdmin = useAuthorization().checkAdminActorAccess();

  const {
    needsConsent: needsMembershipConsent,
    isLoading: isMembershipConsentLoading,
  } = useNeedsMembershipConsent();

  const { needsConsent: needsPhiConsent, isLoading: isPhiConsentLoading } =
    useNeedsPhiMarketingConsent();

  const isLoading = isMembershipConsentLoading || isPhiConsentLoading;

  const queue = useMemo<QueueItem[]>(() => {
    const items: QueueItem[] = [];

    if (needsMembershipConsent) {
      items.push({
        key: 'consent',
        required: true,
        render: (advance) => (
          <ConsentDialog
            open
            onOpenChange={() => {
              /* This modal is required */
            }}
            onFinished={advance}
          />
        ),
      });
    }

    if (needsPhiConsent) {
      items.push({
        key: 'phi-consent',
        required: false,
        render: (advance) => (
          <PhiConsentDialog
            open
            onOpenChange={(next) => {
              if (!next) advance();
            }}
          />
        ),
      });
    }

    return items;
  }, [needsMembershipConsent, needsPhiConsent]);

  const [index, setIndex] = useState(0);

  const advance = () => {
    let nextIndex = index + 1;
    // Skip non-required items
    while (nextIndex < queue.length && !queue[nextIndex].required) {
      nextIndex++;
    }
    setIndex(nextIndex);
  };

  if (isAdmin) return null;

  if (isLoading) return null;

  if (queue.length === 0) return null;

  if (index >= queue.length) return null;

  const active = queue[index];
  return active.render(advance);
};
