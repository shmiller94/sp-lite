import { useState } from 'react';

import { cn } from '@/lib/utils';

import {
  DrawState,
  DRAW_STATES,
  DRAW_STATE_LABELS,
  MOCK_DELAYED,
  MOCK_MULTI_PANEL,
  MOCK_NEEDS_SCHEDULING,
  MOCK_PENDING_BASELINE,
  MOCK_PENDING_CUSTOM,
  MOCK_SCHEDULED,
} from './mock-data';
import { DrawNeedsScheduling } from './states/draw-needs-scheduling';
import { DrawScheduled } from './states/draw-scheduled';
import { MultiPanel } from './states/multi-panel';
import { ResultsDelayed } from './states/results-delayed';
import { ResultsPending } from './states/results-pending';

const StateContent = ({ state }: { state: DrawState }) => {
  switch (state) {
    case 'scheduled':
      return <DrawScheduled data={MOCK_SCHEDULED} />;
    case 'needs-scheduling':
      return <DrawNeedsScheduling data={MOCK_NEEDS_SCHEDULING} />;
    case 'multi-panel':
      return <MultiPanel data={MOCK_MULTI_PANEL} />;
    case 'pending-baseline':
      return <ResultsPending data={MOCK_PENDING_BASELINE} />;
    case 'pending-custom':
      return <ResultsPending data={MOCK_PENDING_CUSTOM} />;
    case 'delayed':
      return <ResultsDelayed data={MOCK_DELAYED} />;
  }
};

export const BloodDrawHubCard = () => {
  const [activeState, setActiveState] = useState<DrawState>('scheduled');

  return (
    <div className="md:rounded-3xl md:bg-white md:p-6 md:shadow-sm">
      {/* Demo toggle bar */}
      <div className="mb-6 rounded-xl bg-zinc-100 p-1">
        <div className="flex flex-wrap gap-1">
          {DRAW_STATES.map((state) => (
            <button
              key={state}
              type="button"
              onClick={() => setActiveState(state)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                activeState === state
                  ? 'bg-white text-zinc-900 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-700',
              )}
            >
              {DRAW_STATE_LABELS[state]}
            </button>
          ))}
        </div>
      </div>

      {/* Active state content */}
      <StateContent state={activeState} />
    </div>
  );
};
