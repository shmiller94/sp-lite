import { ChevronRight } from 'lucide-react';

import { Link } from '@/components/ui/link';
import { Body1 } from '@/components/ui/typography';
import { useLatestFamilyRiskPlan } from '@/features/family-risks';

/**
 * Banner component that displays when the user has a family risk plan available.
 * Links to the family risk plan page.
 */
export const FamilyRiskBanner = () => {
  const { data: plan, isLoading } = useLatestFamilyRiskPlan();

  // Don't render if loading or no plan available
  if (isLoading || !plan || !plan.risks?.length) {
    return null;
  }

  return (
    <div className="mb-6">
      <Link
        to="/family-risk/plan"
        className="group flex cursor-pointer items-center gap-4 overflow-hidden rounded-[20px] bg-no-repeat px-6 py-2 shadow-[0_0_4px_rgba(24,24,27,0.1)]"
        style={{
          backgroundImage:
            "image-set(url('/home/family-risk-banner.webp') type('image/webp'), url('/home/family-risk-banner.png') type('image/png'))",
          backgroundSize: 'auto 100%',
          backgroundPosition: 'left center',
          backgroundColor: '#979485',
        }}
      >
        <div className="size-20 lg:w-28 xl:w-36" />
        <div className="flex-1">
          <Body1 className="text-base text-white">
            What your results may mean
            <br /> for your family
          </Body1>
        </div>
        <ChevronRight className="size-5 text-white transition-all group-hover:-mr-1" />
      </Link>
    </div>
  );
};
