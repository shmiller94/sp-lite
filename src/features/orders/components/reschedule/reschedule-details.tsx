import { CheckCircle2Icon, CircleAlert, Clock4Icon } from 'lucide-react';

import { Body2, H2 } from '@/components/ui/typography';
import { ADVISORY_CALL } from '@/const';
import { OrderStatus, RequestGroup } from '@/types/api';
import { getServiceImage } from '@/utils/service';

import { AppointmentDetails } from '../appointment-details';

export function RescheduleDetails({
  requestGroup,
}: {
  requestGroup: RequestGroup;
}) {
  const orders = requestGroup.orders;

  // TODO: create helper for this
  const serviceName = orders.length === 1 ? orders[0].serviceName : undefined;

  return (
    <div className="space-y-8 px-4">
      <BadgesDisplay requestGroup={requestGroup} />
      <div className="flex flex-col justify-center gap-4 md:max-w-none">
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
            {requestGroup.orders.map((o) => o.serviceName).join(', ')}
          </H2>
        </div>
      </div>
      <AppointmentDetails
        collectionMethod={requestGroup?.collectionMethod}
        slot={
          requestGroup.startTimestamp && requestGroup.endTimestamp
            ? {
                start: requestGroup.startTimestamp,
                end: requestGroup.endTimestamp,
              }
            : undefined
        }
        timezone={requestGroup.timezone}
        location={
          requestGroup?.address
            ? {
                address: requestGroup.address,
                capabilities: requestGroup.appointmentType
                  ? [
                      requestGroup.appointmentType === 'UNSCHEDULED'
                        ? 'WALK_IN'
                        : 'APPOINTMENT_SCHEDULING',
                    ]
                  : // fallback for legacy to always appointment schedyuling
                    ['APPOINTMENT_SCHEDULING'],
                name: '',
              }
            : undefined
        }
        orderIds={requestGroup.orders.map((o) => o.id)}
      />
    </div>
  );
}

const BadgesDisplay = ({ requestGroup }: { requestGroup: RequestGroup }) => {
  const isPastAppointment = requestGroup.startTimestamp
    ? new Date(requestGroup.startTimestamp) < new Date()
    : false;

  const isAdvisoryCall =
    requestGroup.orders.length === 1 &&
    requestGroup.orders[0].serviceName === ADVISORY_CALL;

  return (
    <>
      {isPastAppointment &&
      requestGroup.status !== OrderStatus.completed &&
      !isAdvisoryCall ? (
        <Pill
          Icon={Clock4Icon}
          bg="bg-vermillion-100"
          textColor="text-vermillion-900"
        >
          Results in progress
        </Pill>
      ) : null}
      {requestGroup.status === OrderStatus.revoked ? (
        <Pill Icon={CircleAlert} bg="bg-pink-100" textColor="text-pink-900">
          Order cancelled
        </Pill>
      ) : null}
      {requestGroup.status === OrderStatus.completed ? (
        <Pill
          Icon={CheckCircle2Icon}
          bg="bg-emerald-100"
          textColor="text-emerald-900"
        >
          Order completed
        </Pill>
      ) : null}
    </>
  );
};

// TODO: probably replace with badge
const Pill = ({
  Icon,
  bg,
  textColor,
  children,
}: {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  bg: string;
  textColor: string;
  children: React.ReactNode;
}) => (
  <div
    className={`inline-flex items-center space-x-1 self-start rounded-lg px-2 py-1 ${bg}`}
  >
    <Icon className={`size-4 ${textColor}`} />
    <Body2 className={textColor}>{children}</Body2>
  </div>
);
