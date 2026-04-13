import { createFileRoute } from '@tanstack/react-router';

import { BloodDrawHubCard } from '@/features/homepage/cards/blood-draw-hub/blood-draw-hub-card';

export const Route = createFileRoute('/demo')({
  component: DemoPage,
});

function DemoPage() {
  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-8">
      <div className="mx-auto max-w-xl">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-zinc-900">
            Blood Draw Prep Hub
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Preview all lifecycle states using the toggle below
          </p>
        </div>
        <BloodDrawHubCard />
      </div>
    </div>
  );
}
