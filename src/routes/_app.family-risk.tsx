import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/family-risk')({
  component: Outlet,
});
