import moment from 'moment/moment';
import { useNavigate } from 'react-router-dom';

import {
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown';
import { usePlans } from '@/features/action-plan/api';

export const PlansList = () => {
  const plansQuery = usePlans();
  const navigate = useNavigate();

  const plans = plansQuery.data?.actionPlans;

  if (!plans || !plans.length) {
    return null;
  }

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>View plans</DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          {plans.map((p) => (
            <DropdownMenuItem
              key={p.id}
              onSelect={() => navigate(`/plans/${p.orderId}`)}
            >
              {moment(p.timestamp).format('DD MMMM')}
            </DropdownMenuItem>
          ))}
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
};
