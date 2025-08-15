import { LucideInfo } from 'lucide-react';

import { Body2 } from '@/components/ui/typography';
import { US_STATES, ADDITIONAL_LAB_FEES, COLLECTION_METHODS } from '@/const';
import { useUser } from '@/lib/auth';
import { formatMoney } from '@/utils/format-money';

const NOTICE_STATES = ['NY', 'NJ', 'AZ'];

// This component is used to display a notice about the additional lab fee required for at-home collection
export const AtHomeNoticeSection = ({
  fallbackState,
}: {
  fallbackState?: string;
}) => {
  const { data: user } = useUser();

  const state = user?.primaryAddress?.state ?? fallbackState;
  if (!state) return null;

  if (!NOTICE_STATES.includes(state)) return null;

  const stateName = US_STATES.find((s) => s.value === state)?.label;
  if (!stateName) return null;

  const nynjNotice = (
    <Body2 className="ml-6 text-zinc-400">
      {stateName} State has unique rules around blood test billing. To comply
      with these regulations, there is an additional annual fee of&nbsp;
      {formatMoney(ADDITIONAL_LAB_FEES[state])}. Blood draws are also done in
      the comfort of your own home via our at-home testing partners.
    </Body2>
  );
  const azNotice = (
    <Body2 className="ml-6 text-zinc-400">
      Our Lab partner in {stateName} requires blood tests to be done in the
      comfort of your own home. An at home draw is an additional{' '}
      {formatMoney(COLLECTION_METHODS.AT_HOME.price)} which you will pay when
      scheduling your blood draw in a few steps
    </Body2>
  );

  return (
    <div className="w-full rounded-xl border border-zinc-200 bg-white p-3">
      <div className="mb-1 flex items-center gap-2">
        <LucideInfo className="size-4 text-vermillion-900" />
        <Body2>Additional charge required for {stateName} State</Body2>
      </div>
      {state === 'NY' || state === 'NJ' ? nynjNotice : null}
      {state === 'AZ' ? azNotice : null}
    </div>
  );
};
