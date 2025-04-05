import * as React from 'react';

import { SuperpowerLogo } from '@/components/icons/superpower-logo';
import { Head } from '@/components/seo';
import { Body1, Body2 } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import { HealthcareService } from '@/types/api';

type Props = {
  title: string;
  children: JSX.Element;
  className?: string;
  currentService?: HealthcareService;
};

export const ImageContentLayout = (props: Props) => {
  const { title, children, className, currentService } = props;

  return (
    <>
      <Head title={title} />
      <div className="flex h-dvh w-full flex-col bg-white lg:flex-row">
        <div
          className={cn(
            'min-h-[210px] w-full lg:max-w-[556px] xl:max-w-[33%] bg-female-face bg-no-repeat bg-cover p-8 flex flex-col gap-8 items-center',
            className,
          )}
        >
          <SuperpowerLogo fill="white" />
          {currentService ? (
            <div className="flex w-full max-w-[384px] gap-4 rounded-[20px] border border-white/20 bg-white/5 p-5">
              <img
                className="size-12 min-w-12 rounded-xl object-cover"
                src={currentService.image}
                alt={currentService.description}
              />
              <div>
                <Body1 className="text-white">{currentService.name}</Body1>
                <Body2 className="line-clamp-1 text-white/70">
                  {currentService.description}
                </Body2>
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex h-full flex-1 flex-col py-6 lg:mx-auto lg:min-w-[748px] lg:max-w-[1200px] lg:overflow-y-auto lg:py-10 xl:max-w-[1400px] 2xl:max-w-[1600px]">
          {children}
        </div>
      </div>
    </>
  );
};
