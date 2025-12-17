import { useMemo } from 'react';

import { Body1, H2 } from '@/components/ui/typography';
import { RequestGroup } from '@/types/api';
import { formatMoney } from '@/utils/format-money';
import { getServiceImage } from '@/utils/service';

import { useUpgradeCreditPrice } from '../../api/credits/get-upgrade-credit-price';

import { RescheduleMode } from './reschedule-mode';

export const RescheduleConfirmation = ({
  mode,
  requestGroup,
}: {
  mode: RescheduleMode;
  requestGroup: RequestGroup;
}) => {
  const upgradePriceQuery = useUpgradeCreditPrice({
    upgradeType: 'at-home',
  });

  const isWithin24Hours = useMemo(() => {
    if (!requestGroup.startTimestamp) return false;

    const startTimestamp = new Date(requestGroup.startTimestamp).getTime();
    const now = new Date().getTime();
    return startTimestamp - now < 24 * 60 * 60 * 1000;
  }, [requestGroup.startTimestamp]);

  const isAtHomeAppointment = requestGroup.collectionMethod === 'AT_HOME';
  const price = upgradePriceQuery.data?.price ?? 0;

  const lateFeeMessage = (() => {
    const formattedPrice = formatMoney(price);
    return mode === 'reschedule'
      ? `Your appointment is within 24 hours. As you are rescheduling within 24 hours of your appointment, your ${formattedPrice} booking fee is non-refundable.`
      : `Your appointment is within 24 hours. As you are cancelling within 24 hours of your appointment, your ${formattedPrice} booking fee is non-refundable.`;
  })();

  // TODO: create helper for this
  const serviceName =
    requestGroup.orders.length === 1
      ? requestGroup.orders[0].serviceName
      : undefined;

  return (
    <div className="flex flex-col justify-center gap-4 px-4 md:max-w-none">
      <img
        src={
          serviceName
            ? getServiceImage(serviceName)
            : '/services/custom_blood_panel.png'
        }
        className="block size-[70px] rounded-2xl border border-zinc-200 bg-white  object-cover"
        alt={'Superpower service'}
      />
      <div className="max-w-[220px] space-y-4 md:max-w-none">
        <H2 className="text-zinc-900">
          Are you sure you want to {mode} your order?
        </H2>
      </div>
      {isWithin24Hours &&
        isAtHomeAppointment &&
        (mode === 'reschedule' || mode === 'cancel') && (
          <Body1 className="my-4 rounded-lg bg-vermillion-100 p-4 text-vermillion-900">
            {lateFeeMessage}
          </Body1>
        )}
      {mode === 'cancel' ? (
        requestGroup.appointmentType === 'UNSCHEDULED' ? (
          <Body1 className="text-zinc-500">
            If you’ve already completed your lab visit, please don’t cancel —
            your order will automatically update once we receive your results.
            Canceling after your visit may delay or prevent your results from
            appearing in your portal.
          </Body1>
        ) : (
          <Body1 className="text-zinc-500">
            You can schedule a new appointment from the services page of the
            Superpower app.
          </Body1>
        )
      ) : null}
    </div>
  );
};
