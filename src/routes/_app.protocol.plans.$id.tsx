import { createFileRoute } from '@tanstack/react-router';

import { Head } from '@/components/seo/head';
import { ProtocolDashboard } from '@/features/protocol/components/dashboard';

export const Route = createFileRoute('/_app/protocol/plans/$id')({
  component: ProtocolByIdComponent,
});

function ProtocolByIdComponent() {
  const { id } = Route.useParams();

  return (
    <>
      <Head title="Protocol" />
      <ProtocolDashboard protocolId={id} />
    </>
  );
}
