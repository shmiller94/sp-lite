import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/plans/$id')({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: '/protocol/plans/$id',
      params: {
        id: params.id,
      },
      replace: true,
    });
  },
});
