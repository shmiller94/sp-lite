import { createFileRoute } from '@tanstack/react-router';
import { m, type Variants } from 'framer-motion';
import { ChevronLeft, Share2 } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';

import { SuperpowerSignature } from '@/components/shared/superpower-signature';
import { Button } from '@/components/ui/button';
import { ShimmerDivider } from '@/components/ui/shimmer-divider';
import { Skeleton } from '@/components/ui/skeleton';
import { Body1, Body2, H1 } from '@/components/ui/typography';
import { useLatestFamilyRiskPlan } from '@/features/family-risks/api';
import { FamilyRiskCard } from '@/features/family-risks/components/family-risk-card';
import { FamilyRiskHero } from '@/features/family-risks/components/family-risk-hero';
import { FamilyRiskShareDialog } from '@/features/family-risks/components/family-risk-share-dialog';

export const Route = createFileRoute('/_app/family-risk/plan')({
  component: FamilyRiskPlanComponent,
});

function FamilyRiskPlanComponent() {
  const navigate = Route.useNavigate();
  const { data: plan, isLoading, error } = useLatestFamilyRiskPlan();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBack = () => {
    void navigate({ to: '/' });
  };

  if (isLoading) {
    return <FamilyRiskPlanSkeleton />;
  }

  if (error != null || plan == null) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-900 p-6">
        <Body1 className="text-center text-white">
          No family risk insights available yet.
        </Body1>
        <Body2 className="mt-2 text-center text-white/60">
          Complete a blood test to unlock your family health insights.
        </Body2>
        <Button
          variant="white"
          className="mt-6"
          onClick={() => {
            void navigate({ to: '/services' });
          }}
        >
          View tests
        </Button>
      </div>
    );
  }

  const risks = plan.risks;
  const riskCount = risks.length;

  const riskCards: ReactNode[] = [];
  let index = 0;
  for (const risk of risks) {
    riskCards.push(<FamilyRiskCard key={risk.id} risk={risk} index={index} />);
    index = index + 1;
  }

  const fadeBlur: Variants = {
    hidden: { opacity: 0, y: 4, filter: 'blur(2px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const listContainer: Variants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="relative min-h-screen bg-[#64A0E9]">
      <div className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col">
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 lg:pt-12">
          <Button
            variant="glass"
            size="icon"
            className="size-9 rounded-full"
            onClick={handleBack}
          >
            <ChevronLeft className="size-5" />
          </Button>
          <FamilyRiskShareDialog
            planId={plan.id}
            isPubliclyShared={plan.isPubliclyShared}
          >
            <Button variant="glass" size="icon" className="size-9 rounded-full">
              <Share2 className="size-4" />
            </Button>
          </FamilyRiskShareDialog>
        </div>
        <div className="flex flex-col items-center gap-6 px-6 pb-8 text-center">
          <m.div
            initial={{ opacity: 0, y: 8, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <FamilyRiskHero />
          </m.div>

          <m.div
            variants={listContainer}
            initial="hidden"
            animate="visible"
            className="contents"
          >
            <m.div variants={fadeBlur} className="space-y-2">
              <Body2 className="text-white/50">Family insights</Body2>
              <H1 className="max-w-xs text-white md:text-4xl">
                Knowledge that goes beyond you
              </H1>
            </m.div>
            <m.div variants={fadeBlur}>
              <ShimmerDivider className="h-6" />
            </m.div>
            <m.div variants={fadeBlur}>
              <Body2 className="max-w-sm text-white">
                We don’t just share memories and traditions with our families.
                We also share biology and parts of our health.
              </Body2>
            </m.div>
            <m.div variants={fadeBlur}>
              <ShimmerDivider className="h-6" />
            </m.div>
            <m.div variants={fadeBlur}>
              <Body2 className="max-w-sm text-white/80">
                Because of that, your results can point to trends that matter
                for your family, too.
              </Body2>
            </m.div>
            <m.div variants={fadeBlur}>
              <ShimmerDivider className="h-6" />
            </m.div>
            <m.div variants={fadeBlur}>
              <Body1 className="max-w-sm text-xl text-white">
                Based on your results, we&apos;ve identified {riskCount} pattern
                {riskCount !== 1 ? 's' : ''} that may be shared across your
                family.
              </Body1>
            </m.div>
            <m.div variants={fadeBlur}>
              <ShimmerDivider className="h-6" />
            </m.div>
            <m.div variants={fadeBlur}>
              <Body2 className="max-w-sm italic text-white/80">
                This isn’t a diagnosis or medical advice - just shared learnings
                based on your data.
              </Body2>
            </m.div>
            <ShimmerDivider className="h-6" />
          </m.div>
        </div>
        <div className="flex flex-col gap-24 px-6 pb-6">
          <div className="space-y-6">{riskCards}</div>
          <FamilyRiskShareDialog
            planId={plan.id}
            isPubliclyShared={plan.isPubliclyShared}
          >
            <Button variant="white" className="w-full">
              Share with your family
            </Button>
          </FamilyRiskShareDialog>
        </div>
        <div className="mt-16 flex flex-col items-center">
          <p className="text-xs text-white">Brought to you by</p>
          <SuperpowerSignature isAnimated className="invert" />
        </div>
      </div>
      <div className="pointer-events-none relative -mt-24 w-full overflow-hidden lg:-mt-[50vh]">
        <div
          className="w-screen overflow-hidden rounded-xl blur lg:h-screen"
          style={{
            WebkitMaskImage:
              'linear-gradient(to top, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)',
            maskImage:
              'linear-gradient(to top, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskSize: '100% 100%',
            maskSize: '100% 100%',
          }}
        >
          <video
            src="/family-risk/cloud-background.mp4"
            className="size-full object-cover object-top"
            muted
            autoPlay
            loop
            playsInline
            poster="/family-risk/clouds.webp"
          />
        </div>
      </div>
    </div>
  );
}

function FamilyRiskPlanSkeleton() {
  return (
    <div className="flex min-h-screen flex-col bg-[#64A0E9]">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 p-4 pt-14">
        <Skeleton className="size-9 rounded-full bg-white/20" />
        <Skeleton className="size-9 rounded-full bg-white/20" />
      </div>
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 p-6">
        <Skeleton className="h-4 w-24 bg-white/20" />
        <Skeleton className="h-10 w-64 bg-white/20" />
        <Skeleton className="h-6 w-48 bg-white/20" />
        <Skeleton className="mt-8 h-40 w-full rounded-2xl bg-white/20" />
        <Skeleton className="h-40 w-full rounded-2xl bg-white/20" />
      </div>
    </div>
  );
}
