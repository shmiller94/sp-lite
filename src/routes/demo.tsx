import { createFileRoute } from '@tanstack/react-router';

import { SuperpowerLogo } from '@/components/icons/superpower-logo';
import { BloodDrawHubCard } from '@/features/homepage/cards/blood-draw-hub/blood-draw-hub-card';

export const Route = createFileRoute('/demo')({
  component: DemoPage,
});

const NAV_LINKS = ['Home', 'Data', 'Protocol', 'Concierge', 'Marketplace'];

function DemoPage() {
  return (
    <main className="min-h-screen bg-zinc-50">
      {/* Desktop Navbar */}
      <nav className="sticky top-0 z-50 hidden w-full lg:block">
        <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-8 px-16 py-3">
          <div className="flex flex-1">
            <SuperpowerLogo fill="currentColor" className="w-32 text-black" />
          </div>
          <div className="relative flex flex-1 items-center justify-center">
            <div className="relative flex items-center justify-center rounded-full bg-black p-1 lg:gap-2">
              {NAV_LINKS.map((name, i) => (
                <span
                  key={name}
                  className={`truncate rounded-full px-4 py-1.5 text-sm transition-all duration-150 ${
                    i === 0
                      ? 'bg-primary text-white'
                      : 'text-secondary hover:text-secondary/75'
                  }`}
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-1 items-center justify-end gap-4">
            <span className="text-sm text-black">Invite Friend</span>
            <span className="text-sm text-black">More</span>
          </div>
        </div>
      </nav>

      {/* Page Content - mimics homepage layout */}
      <div className="mx-auto max-w-[1600px] pt-6 md:space-y-6 lg:py-0">
        <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-6 lg:h-full lg:grid-cols-3 lg:gap-16 lg:px-12 lg:py-8 xl:grid-cols-2">
          {/* Left column - Digital Twin placeholder */}
          <div className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
            <div className="flex h-[500px] flex-col items-center justify-center rounded-3xl bg-zinc-100">
              <div className="mb-4 size-32 rounded-full bg-zinc-200" />
              <p className="text-lg font-medium text-zinc-400">Digital Twin</p>
              <p className="mt-1 text-sm text-zinc-300">Demo Mode</p>
            </div>
          </div>

          {/* Right column - Cards */}
          <div className="flex flex-col pb-20 lg:col-span-2 lg:pb-60 xl:col-span-1">
            <div className="space-y-6 lg:px-2">
              <BloodDrawHubCard />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="fixed inset-x-3 bottom-3 z-50 flex h-16 items-center gap-2 lg:hidden">
        <div className="flex h-full flex-1 items-center justify-between rounded-3xl border border-zinc-100 bg-white px-4 shadow-lg shadow-black/[.03]">
          {NAV_LINKS.filter((n) => n !== 'Concierge').map((name, i) => (
            <span
              key={name}
              className={`text-xs ${i === 0 ? 'text-zinc-900' : 'text-zinc-300'}`}
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </main>
  );
}
