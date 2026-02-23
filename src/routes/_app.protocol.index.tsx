import { createFileRoute } from '@tanstack/react-router';

import { Head } from '@/components/seo/head';
import { ProtocolOverview } from '@/features/protocol/components/protocol-overview';

export const Route = createFileRoute('/_app/protocol/')({
  component: () => (
    <>
      <Head title="Protocol" />
      <ProtocolOverview />
    </>
  ),
});
