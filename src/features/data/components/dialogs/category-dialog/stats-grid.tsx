import NumberFlow from '@/components/shared/number-flow';
import { Body3, H4 } from '@/components/ui/typography';
import { STATUS_TO_COLOR } from '@/const/status-to-color';
import { Biomarker } from '@/types/api';

export const StatsGrid = ({ biomarkers }: { biomarkers: Biomarker[] }) => {
  const total = biomarkers.length;
  const optimal = biomarkers.filter((b) => b.status === 'OPTIMAL').length;
  const normal = biomarkers.filter((b) => b.status === 'NORMAL').length;
  const outOfRange = biomarkers.filter(
    (b) => b.status === 'HIGH' || b.status === 'LOW' || b.status === 'ABNORMAL',
  ).length;

  return (
    <div className="mt-4 grid gap-2 md:grid-cols-4">
      <div className="flex flex-col gap-1 rounded-2xl border border-zinc-100 px-3 py-2 shadow-sm">
        <Body3 className="text-secondary">Total Biomarkers</Body3>
        <H4>
          <NumberFlow value={total} />
        </H4>
      </div>
      <div className="flex flex-col gap-1 rounded-2xl border border-zinc-100 px-3 py-2 shadow-sm">
        <Body3 className="text-secondary">Optimal</Body3>
        <H4 style={{ color: STATUS_TO_COLOR.optimal }}>
          <NumberFlow value={optimal} />
        </H4>
      </div>
      <div className="flex flex-col gap-1 rounded-2xl border border-zinc-100 px-3 py-2 shadow-sm">
        <Body3 className="text-secondary">In range</Body3>
        <H4 style={{ color: STATUS_TO_COLOR.normal }}>
          <NumberFlow value={normal} />
        </H4>
      </div>
      <div className="flex flex-col gap-1 rounded-2xl border border-zinc-100 px-3 py-2 shadow-sm">
        <Body3 className="text-secondary">Out of range</Body3>
        <H4 style={{ color: STATUS_TO_COLOR.high }}>
          <NumberFlow value={outOfRange} />
        </H4>
      </div>
    </div>
  );
};
