import React from 'react';

import { Button } from '@/components/ui/button';
import {
  TimelineCard,
  TimelineConnector,
  TimelineDot,
  TimelineDotVariant,
  TimelineHeader,
  TimelineItem,
} from '@/components/ui/timeline';
import { useOrders } from '@/features/orders/api';
import { HealthcareServiceDialog } from '@/features/orders/components/healthcare-service-dialog';
import { HealthcareServiceRescheduleDialog } from '@/features/orders/components/reschedule';
import { useServices } from '@/features/services/api';
import { TimelineItem as TimelineItemType } from '@/types/api';
import { getServiceImage } from '@/utils/service';

/**
 * Wrapping component for TimelineItem to have specific to group logic
 *
 * @param shouldRenderConnector - connects all items in the current block of timeline items
 * @param shouldRenderNextConnector - connects current block with the next block (e.g. onboardingItems with currentItems)
 * @param timelineItem - actual timeline item
 *
 */
const OrderTimelineItem = ({
  shouldRenderConnector,
  shouldRenderNextConnector,
  timelineItem,
}: {
  shouldRenderConnector: boolean;
  shouldRenderNextConnector: boolean;
  timelineItem: TimelineItemType;
}) => {
  const servicesQuery = useServices();
  const getOrdersQuery = useOrders();

  const service = servicesQuery.data?.services.find(
    (s) => s.name === timelineItem.name,
  );
  const order = getOrdersQuery.data?.orders.find(
    (o) => o.id === timelineItem.id,
  );

  if (!order) return null;

  const renderTimelineButton = () => {
    switch (timelineItem.status) {
      case 'ACTION_REQUIRED': {
        // reason #1: we cannot render booking without full service info
        // reason #2:
        // If healthcare service was not found it likely means that
        // we depricated it and do not show anymore
        // this was done during 199 (superpower v2) migration
        // to normalize all data and this behaviour is expected
        // before changing this code please double check with
        //   Nikita or Dan <3
        if (!service) return;

        return (
          <HealthcareServiceDialog healthcareService={service}>
            <Button className="bg-white" size="medium" variant="outline">
              Book
            </Button>
          </HealthcareServiceDialog>
        );
      }
      case 'CURRENT':
        return (
          <HealthcareServiceRescheduleDialog
            healthcareService={service}
            order={order}
          >
            <Button className="bg-white" size="medium" variant="outline">
              More details
            </Button>
          </HealthcareServiceRescheduleDialog>
        );
      default:
        return null;
    }
  };

  return (
    <TimelineItem>
      {shouldRenderConnector ? <TimelineConnector /> : null}
      {shouldRenderNextConnector ? <TimelineConnector /> : null}
      <TimelineHeader>
        <TimelineDot
          className="hidden md:block"
          status={timelineItem.status.toLowerCase() as TimelineDotVariant}
        />
        <TimelineCard
          image={getServiceImage(order.serviceName)}
          title={timelineItem.name}
          description={timelineItem.description}
          variant={timelineItem.status === 'DISABLED' ? 'disabled' : 'default'}
          button={renderTimelineButton()}
        />
      </TimelineHeader>
    </TimelineItem>
  );
};

export default React.memo(OrderTimelineItem);
