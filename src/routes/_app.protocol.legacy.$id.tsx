import { createFileRoute } from '@tanstack/react-router';

import { Head } from '@/components/seo/head';
import { LegacyProtocolDashboard } from '@/features/protocol/components/dashboard';

export const Route = createFileRoute('/_app/protocol/legacy/$id')({
  component: LegacyProtocolByIdComponent,
});

function LegacyProtocolByIdComponent() {
  const { id } = Route.useParams();

  return (
    <>
      <Head title="Protocol" />
      <LegacyProtocolDashboard protocolId={id} />
    </>
  );
}
