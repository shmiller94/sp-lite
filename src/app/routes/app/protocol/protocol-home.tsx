import { Head } from '@/components/seo/head';
import { ProtocolOverview } from '@/features/protocol/components/protocol-overview';

export const ProtocolRoute = () => {
  return (
    <>
      <Head title="Protocol" />
      <ProtocolOverview />
    </>
  );
};
