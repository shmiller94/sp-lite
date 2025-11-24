import { XCircle } from 'lucide-react';

import { Body1, Body2 } from '@/components/ui/typography';
import { formatMoney } from '@/utils/format-money';

import { Activity } from '../../api';

// TODO: Once we have this activate
export const CheckoutAvoidCard = ({ _activity }: { _activity?: Activity }) => {
  // const item = getItemDetails(activity);

  return (
    <div className="flex w-full items-center gap-4 rounded-2xl border border-zinc-200 bg-zinc-100 p-4 shadow-sm transition-all duration-200">
      <XCircle className="size-4 text-zinc-400" />
      <div className="flex flex-1 items-center gap-3">
        {/*{item.image && (
          <img
            src={item.image}
            alt={item.title}
            className="size-12 rounded-md object-cover"
          />
        )}*/}
        <div className="flex flex-1 items-center space-y-1">
          <Body1 className="font-medium">{'Ashwaganda'}</Body1>
          {/*{activity.overview && (
            <Body2 className="leading-relaxed text-secondary">
              {activity.overview}
            </Body2>
          )}*/}
        </div>
        <div className="flex items-center gap-2 text-right">
          <Body2 className="text-zinc-500 line-through">1000</Body2>
          <Body2 className="font-semibold">{formatMoney(1000)}</Body2>
        </div>
      </div>
    </div>
  );
};
