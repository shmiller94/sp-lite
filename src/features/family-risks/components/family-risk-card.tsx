import { Body2, Body3 } from '@/components/ui/typography';

import type { FamilyRisk } from '../api';

import { FamilyRiskDetailDialog } from './family-risk-detail-dialog';
import { InheritedRiskIndicator } from './inherited-risk-indicator';

type FamilyRiskCardProps = {
  risk: FamilyRisk;
  index: number;
};

/**
 * Card displaying a single family risk with inherited score indicator
 * Opens a drawer with full details on click
 */
export function FamilyRiskCard({ risk, index }: FamilyRiskCardProps) {
  return (
    <div className="flex flex-col items-center gap-6 py-4">
      {/* Risk label and title */}
      <div className="w-full space-y-2 text-center">
        <Body3 className="text-white/50">
          {String(index + 1).padStart(2, '0')}
        </Body3>
        <Body2 className="text-lg text-white">{risk.title}</Body2>
      </div>

      {/* Inherited risk indicator and learn more */}
      <div className="flex w-full flex-col items-center gap-4">
        <InheritedRiskIndicator
          score={risk.inheritedRiskScore}
          variant="dark"
          className="w-full"
        />

        <FamilyRiskDetailDialog risk={risk} index={index}>
          <button className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white transition-colors hover:bg-white/20">
            Learn more
          </button>
        </FamilyRiskDetailDialog>
      </div>
    </div>
  );
}
