import { NavLink } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Body1, Body2 } from '@/components/ui/typography';

export const Banner: React.FC = () => {
  return (
    <div className="mb-6 md:pl-9">
      <ReferAFriendBanner />
    </div>
  );
};

export const ReferAFriendBanner: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl">
      <img
        className="absolute inset-0 z-0 size-full object-fill"
        src="/home/banner.webp"
        aria-hidden="true"
        alt=""
      ></img>
      <div className="absolute inset-0 size-full rounded-3xl border border-white/25"></div>
      <div className="relative flex items-stretch justify-between px-5">
        <div className="flex gap-4">
          <div className="relative h-full w-12 shrink-0">
            <img
              src="/home/blood-tube.webp"
              alt="Blood tube illustration"
              className="absolute bottom-0 size-full object-cover object-top px-2 pt-5"
            />
          </div>
          <div className="py-5 pr-2">
            <Body1 className="text-white">
              Refer your friends and earn $50
            </Body1>
            <Body2 className="line-clamp-1 text-white/50">
              They&apos;ll receive $50 off their membership too
            </Body2>
          </div>
        </div>
        <div className="py-5">
          <NavLink to={`/invite`}>
            <Button variant="outline" className="bg-white" size="medium">
              Earn $50
            </Button>
          </NavLink>
        </div>
      </div>
    </div>
  );
};
