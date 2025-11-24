import moment from 'moment';
import { useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Body1, Body2, Body3, H3 } from '@/components/ui/typography';
import { CUSTOM_BLOOD_PANEL } from '@/const';
import { useOrders } from '@/features/orders/api';
import { HealthcareServiceDialog } from '@/features/orders/components/healthcare-service-dialog';
import { BookingStepID } from '@/features/orders/utils/get-steps-for-service';
import { useRevealStatus } from '@/features/protocol/api';
import type {
  RevealServiceItem,
  ServiceFulfillmentStatus,
} from '@/features/protocol/api/reveal';
import { REVEAL_STEPS } from '@/features/protocol/components/reveal/reveal-stepper';
import { useServices } from '@/features/services/api';
import { HealthcareService, Order } from '@/types/api';
import { getServiceImage } from '@/utils/service';

import { CheckoutLayout } from '../../layouts/checkout-layout';

type ServiceBookingStepProps = {
  carePlanId: string;
  next: () => void;
  previous: () => void;
};

type ServiceBookingDisplay = {
  item: RevealServiceItem;
  service?: HealthcareService;
  bookingService?: HealthcareService;
  order?: Order;
  status: ServiceFulfillmentStatus;
  initialAddOnIds?: string[];
  excludeSteps?: BookingStepID[];
};

export const ServiceBookingStep = ({
  carePlanId,
  next,
  previous: _previous,
}: ServiceBookingStepProps) => {
  const revealStatusQuery = useRevealStatus(carePlanId);
  const servicesQuery = useServices();
  const ordersQuery = useOrders();

  const servicesData = servicesQuery.data?.services;
  const ordersData = ordersQuery.data?.orders;
  const serviceItemsData =
    revealStatusQuery.data?.reveal.protocolOrder?.serviceItems;
  const statusByServiceIdData =
    revealStatusQuery.data?.fulfillmentStates.services;

  const services = useMemo(() => servicesData ?? [], [servicesData]);
  const orders = useMemo(() => ordersData ?? [], [ordersData]);
  const serviceItems = useMemo(
    () => serviceItemsData ?? [],
    [serviceItemsData],
  );
  const statusByServiceId = useMemo(
    () => statusByServiceIdData ?? {},
    [statusByServiceIdData],
  );

  const servicesById = useMemo(
    () => new Map(services.map((svc) => [svc.id, svc])),
    [services],
  );
  const servicesByName = useMemo(
    () => new Map(services.map((svc) => [svc.name, svc])),
    [services],
  );
  const ordersById = useMemo(
    () => new Map(orders.map((order) => [order.id, order])),
    [orders],
  );

  const bookings = useMemo<ServiceBookingDisplay[]>(() => {
    const bookings = serviceItems
      .filter((item) => item.fhirServiceRequestId)
      .map((item) => {
        const service =
          servicesById.get(item.serviceId) ??
          servicesByName.get(item.serviceName);
        const bookingService = service;

        const orderId = item.fhirServiceRequestId;
        const order = orderId ? ordersById.get(orderId) : undefined;

        let initialAddOnIds: string[] | undefined;
        if (
          bookingService?.name === CUSTOM_BLOOD_PANEL &&
          order?.addOnServiceIds?.length
        ) {
          initialAddOnIds = order.addOnServiceIds;
        }

        return {
          item,
          service,
          bookingService,
          order,
          status: statusByServiceId[item.id] ?? 'PENDING',
          initialAddOnIds,
        };
      });

    return bookings.filter(
      (booking) => booking.bookingService && booking.status !== 'PENDING',
    );
  }, [
    ordersById,
    serviceItems,
    servicesById,
    servicesByName,
    statusByServiceId,
  ]);

  const phlebotomyBookings = bookings.filter(
    (booking) => booking.bookingService?.phlebotomy,
  );
  const kitBookings = bookings.filter(
    (booking) => booking.bookingService && !booking.bookingService.phlebotomy,
  );

  const isLoading =
    revealStatusQuery.isLoading ||
    servicesQuery.isLoading ||
    ordersQuery.isLoading;

  const hasServices = bookings.length > 0;
  const allBooked =
    !hasServices || bookings.every((booking) => booking.status === 'BOOKED');

  if (!isLoading && !hasServices) {
    next();
  }

  return (
    <CheckoutLayout
      step={REVEAL_STEPS.SERVICE_BOOKING}
      className="pt-8 lg:pt-16"
    >
      <div className="col-span-2 mx-auto w-full max-w-3xl space-y-8 px-6 lg:px-0">
        <div className="space-y-3 text-center">
          <H3>Let’s finish booking your services</H3>
          <Body1 className="text-secondary">
            Complete the steps for each service to continue your protocol.
          </Body1>
        </div>

        {isLoading ? (
          <div className="flex min-h-[200px] items-center justify-center">
            <Spinner variant="primary" />
          </div>
        ) : hasServices ? (
          <div className="space-y-8">
            {phlebotomyBookings.length > 0 && (
              <ServiceBookingSection
                title="Blood draw appointments"
                description="Schedule an in-person or in-home visit."
                bookings={phlebotomyBookings}
                onRefresh={revealStatusQuery.refetch}
              />
            )}
            {kitBookings.length > 0 && (
              <ServiceBookingSection
                title="At-home collection kits"
                description="Confirm shipping details and consent so we can send your kit."
                bookings={kitBookings}
                onRefresh={revealStatusQuery.refetch}
              />
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-zinc-200 bg-white/60 p-8 text-center">
            <Body1 className="text-secondary">
              There are no services to book right now.
            </Body1>
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 pt-4">
          <Button
            className="w-full sm:flex-1"
            disabled={!allBooked}
            onClick={next}
          >
            {allBooked ? 'Continue' : 'Book each service to continue'}
          </Button>
        </div>
      </div>
    </CheckoutLayout>
  );
};

const ServiceBookingSection = ({
  title,
  description,
  bookings,
  onRefresh,
  hideActions = false,
}: {
  title: string;
  description: string;
  bookings: ServiceBookingDisplay[];
  onRefresh: () => void;
  hideActions?: boolean;
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Body2 className="uppercase tracking-wide text-secondary">
          {title}
        </Body2>
        <Body2 className="text-secondary">{description}</Body2>
      </div>
      <div className="space-y-3">
        {bookings.map((booking) => (
          <ServiceBookingCard
            key={booking.item.id}
            booking={booking}
            onRefresh={onRefresh}
            hideActions={hideActions}
          />
        ))}
      </div>
    </div>
  );
};

const ServiceBookingCard = ({
  booking,
  onRefresh,
  hideActions,
}: {
  booking: ServiceBookingDisplay;
  onRefresh: () => void;
  hideActions?: boolean;
}) => {
  const { bookingService, service, order, status, item, initialAddOnIds } =
    booking;

  const serviceName = service?.name ?? item.serviceName;
  const description = service?.description;
  const scheduledWindow = formatScheduledWindow(order);
  const isBooked = status === 'BOOKED';
  const buttonLabel = isBooked ? 'Booked' : 'Complete booking';
  const serviceImage = getServiceImage(serviceName);

  return (
    <div className="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          {serviceImage ? (
            <img
              src={serviceImage}
              alt={serviceName}
              className="size-16 rounded-xl object-cover object-center"
            />
          ) : null}
          <div className="space-y-2">
            <Body1>{serviceName}</Body1>
            {description ? (
              <Body2 className="text-secondary">{description}</Body2>
            ) : null}
            {bookingService?.name === CUSTOM_BLOOD_PANEL &&
              initialAddOnIds &&
              initialAddOnIds.length > 0 && (
                <Body3 className="text-emerald-700">
                  {initialAddOnIds.length} add-on
                  {initialAddOnIds.length > 1 ? 's' : ''} preselected
                </Body3>
              )}
            {scheduledWindow && (
              <Body2 className="text-secondary">
                Scheduled for {scheduledWindow}
              </Body2>
            )}
          </div>
        </div>
        <div className="flex items-center justify-end">
          {bookingService && !hideActions ? (
            <HealthcareServiceDialog
              healthcareService={bookingService}
              excludeSteps={[BookingStepID.INFO]}
              initialAddOnIds={initialAddOnIds}
              onClose={onRefresh}
            >
              <Button size="medium" disabled={isBooked}>
                {buttonLabel}
              </Button>
            </HealthcareServiceDialog>
          ) : null}
        </div>
      </div>
    </div>
  );
};

const formatScheduledWindow = (order?: Order) => {
  if (!order?.startTimestamp) {
    return null;
  }

  const start = moment(order.startTimestamp).format('MMM D, h:mma');
  if (!order.endTimestamp) {
    return start;
  }
  const end = moment(order.endTimestamp).format('h:mma');
  return `${start} – ${end}`;
};
