import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { LockIcon } from '@/components/icons';
import { PlusCircleIcon } from '@/components/icons/plus-circle';
import { ContentLayout } from '@/components/layouts';
// import { AffiliateBanner } from '@/features/affiliate/components/affiliate-banner';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown';
import { TimelineList } from '@/features/home/components/timeline-list';
import { GreetingComponent } from '@/features/home/greeting';

export const HomeRoute = () => {
  const [tab, setTab] = useState<'timeline' | 'twin'>('timeline');

  return (
    <ContentLayout title="Home">
      {/* <AffiliateBanner /> */}
      <div className="relative mt-[-134px] h-[800px] w-full">
        <div className="absolute left-1/2 top-0 h-full w-screen -translate-x-1/2 overflow-hidden">
          <GreetingComponent />
          <div className="absolute bottom-0 z-50 h-40 w-full rounded-t-[32px] bg-white" />
        </div>
      </div>
      <div className="relative -top-40 w-full md:-top-24">
        <div className="relative left-1/2 mb-16 flex w-screen -translate-x-1/2 items-center gap-6 border-b border-b-zinc-200 px-6 pb-4 md:w-auto md:justify-center md:border-b-0 md:px-0 md:pb-0">
          <button
            onClick={() => setTab('timeline')}
            className="text-right text-lg md:w-40 md:text-2xl"
          >
            Timeline
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger className="hidden overflow-hidden rounded-full text-2xl transition-all duration-300 ease-in-out data-[state=open]:rotate-45 md:block">
              <PlusCircleIcon className="hover:text-zinc-700" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => scrollTo({ top: 0, behavior: 'smooth' })}
                asChild
              >
                <Link to="./services?tab=all">Book service</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  onClick={() => scrollTo({ top: 0, behavior: 'smooth' })}
                  to="./settings?tab=health+records"
                >
                  Upload health record
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <button
            disabled
            onClick={() => setTab('twin')}
            className="text-lg disabled:opacity-20 md:w-40 md:text-2xl"
          >
            <LockIcon
              className="mb-1 mr-2 inline-flex size-4 md:size-6"
              fill="currentColor"
            />
            Digital Twin
          </button>
        </div>
        {tab === 'timeline' && <TimelineList />}
      </div>
    </ContentLayout>
  );
};
