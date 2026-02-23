import { createFileRoute } from '@tanstack/react-router';

import { Head } from '@/components/seo/head';
import { ProtocolOverview } from '@/features/protocol/components/protocol-overview';

export const Route = createFileRoute('/_app/protocol/plans/$id')({
  component: ProtocolByIdComponent,
});

function ProtocolByIdComponent() {
  const { id } = Route.useParams();

  return (
    <>
      <Head title="Protocol" />
      <ProtocolOverview protocolId={id} />
    </>
  );
}
