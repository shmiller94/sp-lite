import { createFileRoute } from '@tanstack/react-router';

import { Head } from '@/components/seo/head';
import { ProtocolSmartRouter } from '@/features/protocol/components/protocol-smart-router';

export const Route = createFileRoute('/_app/protocol/')({
  component: () => (
    <>
      <Head title="Protocol" />
      <ProtocolSmartRouter />
    </>
  ),
});
