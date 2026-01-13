import { useAuthorization } from '@/lib/authorization';
import { OrderStatus, RequestGroup } from '@/types/api';

export const useAppointmentManagement = ({
  requestGroup,
}: {
  requestGroup: RequestGroup;
}) => {
  const isPastAppointment = requestGroup.startTimestamp
    ? new Date(requestGroup.startTimestamp) < new Date()
    : false;

  const hasAppointmentType = requestGroup.appointmentType !== undefined;

  const isRevokedOrCompleted = [
    OrderStatus.revoked,
    OrderStatus.completed,
  ].includes(requestGroup.status);

  const { checkAdminActorAccess } = useAuthorization();
  const isAdminActor = checkAdminActorAccess();

  const canManageAppointment =
    (!isPastAppointment && !isRevokedOrCompleted && hasAppointmentType) ||
    isAdminActor;

  return {
    canManageAppointment,
  };
};
