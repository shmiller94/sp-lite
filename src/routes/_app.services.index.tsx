import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/services/')({
  beforeLoad: () => {
    throw redirect({
      to: '/marketplace',
      replace: true,
    });
  },
});
