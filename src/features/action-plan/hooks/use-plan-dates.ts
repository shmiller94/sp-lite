import { useEffect, useState } from 'react';

import { usePlanDates } from '@/features/action-plan/api';

interface UseActionPlanDatePickerProps {
  setOrderId: (orderId?: string) => void;
}

export const useActionPlanDatePicker = ({
  setOrderId,
}: UseActionPlanDatePickerProps) => {
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const { data: planDatesData } = usePlanDates();

  const planDates = planDatesData?.availableDates;

  useEffect(() => {
    if (!planDates) return;

    if (planDates.length === 0) {
      setCurrentDate(null);
      setOrderId(undefined);
    } else {
      const { timestamp, orderId } = planDates[0];

      setCurrentDate(new Date(timestamp));
      setOrderId(orderId);
    }
  }, [planDates]);

  return {
    currentDate,
    setCurrentDate,
    planDates,
  };
};
