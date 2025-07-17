import { Button } from '@/components/ui/button';
import { Body2, H1 } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

import { ONBOARDING_FEATURES } from './const/onboarding-features';

export const WelcomeScreen = ({ handleNext }: { handleNext: () => void }) => {
  return (
    <div className="flex w-full flex-1 flex-col items-center justify-start md:justify-center">
      <p className="mb-2 text-center text-sm text-white duration-300 animate-in fade-in slide-in-from-bottom-4">
        Payment Successful!
      </p>
      <H1 className="mx-auto mb-10 max-w-md text-center text-white duration-500 animate-in fade-in slide-in-from-bottom-4 max-md:text-5xl md:max-w-xl">
        Welcome to <br />{' '}
        <span className="text-white/65 backdrop-blur-lg">Superpower</span>
      </H1>
      <div className="mx-auto mb-8 w-full max-w-xl rounded-2xl border border-white/[16%] bg-white/20 p-6 backdrop-blur-md duration-1000 animate-in fade-in slide-in-from-bottom-4">
        <div className="space-y-3 md:space-y-4">
          {ONBOARDING_FEATURES.map((feature, index) => (
            <div key={feature} className="flex items-center gap-2">
              <AnimatedCheckIcon
                fill="white"
                delay={index * 0.4}
                className="mt-px"
              />
              <Body2
                className="text-white animate-in fade-in"
                style={{ animationDuration: `${index * 0.8}s` }}
              >
                {feature}
              </Body2>
            </div>
          ))}
        </div>
      </div>
      <Button
        variant="white"
        className="absolute bottom-8 mx-auto w-full max-w-[calc(100%-2rem)] bg-white px-8 py-4 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 hover:opacity-80 md:static md:max-w-xl"
        onClick={handleNext}
      >
        Continue
      </Button>
    </div>
  );
};

const AnimatedCheckIcon = ({
  fill = 'currentColor',
  delay = 0,
  className,
}: {
  fill: string;
  delay?: number;
  className?: string;
}) => {
  return (
    <div
      className={cn('shrink-0', className)}
      style={{
        animation: `check-scale ${delay}s ease-out forwards`,
        transform: 'scale(0)',
      }}
    >
      <svg
        width="17"
        height="17"
        viewBox="0 0 17 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <style>
          {`
            @keyframes check-scale {
              0% {
                transform: scale(0);
                opacity: 0;
              }
              50% {
                transform: scale(1.2);
                opacity: 1;
              }
              100% {
                transform: scale(1);
                opacity: 1;
              }
            }
            @keyframes check-draw {
              0% {
                clip-path: polygon(0 0, 0 0, 0 100%, 0 100%);
              }
              100% {
                clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
              }
            }
          `}
        </style>
        <g
          style={{
            animation: `check-draw ${delay + 0.3}s ease-out forwards`,
            clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)',
          }}
        >
          <path
            d="M13.7824 4.61133L6.44906 11.9447L3.11572 8.61133"
            stroke={fill}
            strokeWidth="1.33333"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </div>
  );
};
