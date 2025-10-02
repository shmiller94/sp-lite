import { Button } from '@/components/ui/button';
import { Body1, Body3, H1 } from '@/components/ui/typography';

export const IntakeScreen = ({ handleNext }: { handleNext: () => void }) => {
  return (
    <div className="flex w-full flex-1 flex-col items-center justify-start md:justify-center">
      <H1 className="mb-6 w-full max-w-full text-center text-white duration-500 animate-in fade-in slide-in-from-bottom-4 max-md:text-5xl sm:w-full">
        Let&apos;s get to know you
      </H1>
      <Body1 className="mb-8 max-w-md text-balance text-center text-white duration-500 animate-in fade-in slide-in-from-bottom-4 md:max-w-lg">
        We’re going to ask a few short questions about your health.
        <br />
        <br />
        Everything you share – your goals, challenges, & experiences – helps us
        personalize your health insights, action plan, and journey with
        Superpower.
      </Body1>
      <div className="absolute bottom-8 flex w-full max-w-[calc(100%-2rem)] flex-col gap-4 md:static">
        <Button
          variant="white"
          className="mx-auto w-full bg-white px-8 py-4 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 hover:opacity-80 md:max-w-[450px]"
          onClick={handleNext}
        >
          Complete intake
        </Button>
        <Body3 className="order-first mx-auto max-w-md text-center text-white duration-500 animate-in fade-in slide-in-from-bottom-4 md:order-last">
          This is required to schedule your lab test.{' '}
          <br className="md:hidden" />
          <br className="md:hidden" /> Estimated time to complete: 20 min
        </Body3>
      </div>
    </div>
  );
};
