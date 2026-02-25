import { Link } from '@tanstack/react-router';
import { ChevronRightIcon } from 'lucide-react';

import { Body1, Body2 } from '@/components/ui/typography';
import { useLatestProtocol } from '@/features/protocol/api';

import { DigitalTwinPreviewMobile } from '../components/digital-twin-preview-mobile';
import { HomepageCard } from '../components/homepage-card';

import { ScoreCards } from './score-cards';

export const AiapSummaryCardWeb = () => {
  const { data: protocolData } = useLatestProtocol();
  const protocol = protocolData?.protocol;

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <HomepageCard
      titleClassName="mb-4 hidden md:block"
      title="Your summary"
      className="relative overflow-hidden"
    >
      {/* Mobile digital twin preview */}
      <div className="lg:hidden">
        <DigitalTwinPreviewMobile />
      </div>

      <ScoreCards />
      {protocol && (
        <Link
          to={`/protocol`}
          className="group relative mt-8 flex flex-col rounded-2xl border border-zinc-200 p-4 transition-all duration-200 ease-out hover:bg-zinc-50"
        >
          <Body1 className="relative z-10">
            Review your action plan{' '}
            <ChevronRightIcon className="mb-0.5 inline size-4 text-zinc-400 transition-all ease-out group-hover:ml-0.5" />
          </Body1>
          <Body2 className="relative z-10 text-zinc-400">
            Updated {formatDate(protocol.createdAt)}
          </Body2>
          <div className="pointer-events-none absolute -right-1 bottom-0 w-36 shrink-0 duration-500 ease-out animate-in fade-in-20">
            <img
              src="/home/action-plan.webp"
              alt="Action plan illustration"
              className="size-full object-contain object-right"
              loading="lazy"
              decoding="async"
            />
          </div>
        </Link>
      )}
    </HomepageCard>
  );
};
