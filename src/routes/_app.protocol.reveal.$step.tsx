import { createFileRoute } from '@tanstack/react-router';

import { ProtocolRevealRoute } from '@/app/routes/app/protocol/protocol-reveal';

export const Route = createFileRoute('/_app/protocol/reveal/$step')({
  component: ProtocolRevealRoute,
});
