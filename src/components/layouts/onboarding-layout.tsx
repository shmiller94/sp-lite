import { ChevronLeft } from 'lucide-react';
import * as React from 'react';

import { Head } from '@/components/seo';
import { Button } from '@/components/ui/button';
import { useStepper } from '@/components/ui/stepper';
import { cn } from '@/lib/utils';

const OnboardingStepLayoutHeader = () => {
  const { prevStep, activeStep } = useStepper((s) => s);
  return (
    <section id="header" className="flex w-full items-center justify-between">
      {activeStep !== 0 ? (
        <Button
          variant="glass"
          // z-999999 here to make it work with the typeform integration
          className="z-[999999] size-12 rounded-full p-0"
          onClick={() => {
            prevStep();
          }}
        >
          <ChevronLeft className="size-4" />
        </Button>
      ) : (
        <div className="size-12" />
      )}
      <div className="w-[114px]">
        <img className="w-auto" src="/logo.svg" alt="logo" />
      </div>
      <div className="size-12" />
    </section>
  );
};

type Props = {
  className?: string;
  title: string;
  children: JSX.Element;
};

export const OnboardingLayout = (props: Props) => {
  return (
    <>
      <Head title={props.title} />
      <div className="flex min-h-screen w-full flex-col p-8 md:p-6">
        <div
          className={cn(
            'fixed left-0 top-0 z-[-1] h-screen w-full bg-spine bg-cover',
            props.className,
          )}
        />
        <div className="flex w-full flex-1 flex-col">
          <OnboardingStepLayoutHeader />
          <div className="flex w-full flex-1 flex-col items-center justify-center">
            {props.children}
          </div>
          <section id="footer"></section>
        </div>
      </div>
    </>
  );
};
