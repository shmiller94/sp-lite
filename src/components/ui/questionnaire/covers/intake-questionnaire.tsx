import { SuperpowerLogo } from '@/components/icons/superpower-logo';
import { H1 } from '@/components/ui/typography';

export const IntakeQuestionnaireCover = ({
  handleStartQuestionnaire,
}: {
  handleStartQuestionnaire: () => void;
}) => {
  return (
    <main className="flex min-h-svh w-full flex-col overflow-hidden bg-cover">
      <div
        className="flex w-full flex-1 flex-col items-center justify-center bg-cover bg-center p-16"
        style={{ backgroundImage: "url('/onboarding/bg-male-v2.webp')" }}
      >
        <SuperpowerLogo fill="#fff" />
        <div className="flex w-full flex-1 flex-col items-center justify-center">
          <p className="mb-2 text-center text-sm text-white md:mb-6">
            Personalize Superpower to you
          </p>
          <H1 className="mx-auto mb-12 max-w-md text-center text-white md:max-w-xl">
            Tell us about your health story
          </H1>
          <button
            className="mx-auto w-full max-w-xs rounded-full bg-white px-8 py-4 transition-all hover:opacity-80"
            onClick={handleStartQuestionnaire}
          >
            Get Started
          </button>
        </div>
      </div>
    </main>
  );
};
