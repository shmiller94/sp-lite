import { createFileRoute, Outlet } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import { z } from 'zod';

const protocolSearchSchema = z.object({
  tab: z.enum(['protocol', 'goals']).optional().catch(undefined),
});

export const Route = createFileRoute('/_app/protocol')({
  validateSearch: zodValidator(protocolSearchSchema),
  component: Outlet,
});
