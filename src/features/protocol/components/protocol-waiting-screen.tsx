import QuickLink from '@/components/shared/quicklink';
import { Body2, H2, H4 } from '@/components/ui/typography';
import { useDataGating } from '@/features/data/hooks/use-data-gating';
import { PhlebotomyProgress } from '@/features/homepage/cards/phlebotomy-appointment/phlebotomy-progress';
import { useUser } from '@/lib/auth';

export const ProtocolWaitingScreen = () => {
  const { data: user } = useUser();
  const gating = useDataGating();

  const ETA = gating.hasAnyBiomarkers ? '4-7' : '7-10';
  const title = gating.hasAnyBiomarkers
    ? 'Your results are being analyzed'
    : 'Your results are pending';

  return (
    <div className="mx-auto max-w-3xl flex-1 overflow-y-auto rounded-[24px] bg-white p-6 scrollbar scrollbar-track-transparent scrollbar-thumb-zinc-300">
      <div className="size-full">
        <H4 className="mb-2">Hi {user?.firstName},</H4>
        <Body2 className="mb-4 text-zinc-400">
          We are currently awaiting and analysing your first test results. They
          should be with you in {ETA} days. You&apos;ll receive an e-mail once
          your results are ready and your protocol is created.
        </Body2>
        <div className="py-6">
          <PhlebotomyProgress status="processing" />
        </div>
        <div className="flex flex-col gap-4 md:flex-row md:flex-wrap">
          <QuickLink
            to="/services"
            title={title}
            className="relative w-full overflow-hidden"
          >
            <div className="relative z-20">
              <H2>
                {ETA} <span className="text-xl">days</span>
              </H2>
              <Body2 className="text-zinc-400">
                Until your protocol is available
              </Body2>
            </div>
            <div className="pointer-events-none absolute bottom-0 z-10 h-24 w-full bg-gradient-to-b from-transparent to-white transition-colors group-hover:to-zinc-50" />
          </QuickLink>
        </div>
      </div>
    </div>
  );
};
