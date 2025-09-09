import { motion } from 'framer-motion';
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
      <div
        className="absolute inset-0 z-0 size-full"
        style={{
          background:
            'linear-gradient(120deg, #FA992F 0%, #c2410c 26%, #FA992F 100%)',
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 size-full rounded-3xl border border-white/25"></div>
      <div className="relative flex items-stretch justify-between px-5">
        <div className="flex gap-4">
          <div className="relative h-full w-12 shrink-0">
            <motion.img
              src="/home/blood-tube.webp"
              alt="Blood tube illustration"
              className="pointer-events-none absolute bottom-0 size-full select-none object-cover object-top px-2 pt-5"
              initial={{ y: 12 }}
              animate={{ y: 0 }}
              transition={{
                type: 'easeInOut',
                stiffness: 220,
                damping: 20,
                mass: 0.9,
              }}
            />
          </div>
          <div className="py-5 pr-2">
            <Body1 className="text-white">
              Refer your friends and earn $50
            </Body1>
            <Body2 className="line-clamp-1 text-white/50">
              Get $50 each when your friend joins Superpower.
            </Body2>
          </div>
        </div>
        <div className="flex flex-col justify-center py-5">
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
