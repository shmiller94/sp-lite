import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { isBloodPanel } from '@/const/services';
import { getTimelineQueryOptions } from '@/features/home/api/get-timeline';
import {
  consentInputSchema,
  locationInputSchema,
} from '@/features/orders/api/create-order';
import { getOrdersQueryOptions } from '@/features/orders/api/get-orders';
import { getServicesQueryOptions, useServices } from '@/features/services/api';
import { useAnalytics } from '@/hooks/use-analytics';
import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { Order } from '@/types/api';

export const updateOrderInputSchema = z.object({
  location: locationInputSchema.optional(),
  timestamp: z.string().optional(),
  externalId: z.string().optional(),
  timezone: z.string().optional(),
  informedConsent: consentInputSchema.optional(),
  method: z.enum(['AT_HOME', 'IN_LAB', 'PHLEBOTOMY_KIT', 'EVENT']).optional(),
  status: z
    .enum([
      'UPCOMING',
      'COMPLETED',
      'CANCELLED',
      'REVOKED',
      'DRAFT',
      'PENDING',
      'ACTIVE',
    ])
    .optional(),
});

export type UpdateOrderInput = z.infer<typeof updateOrderInputSchema>;

export const updateOrder = ({
  orderId,
  data,
}: {
  orderId: string;
  data: UpdateOrderInput;
}): Promise<{ order: Order }> => {
  return api.put(`/orders/${orderId}`, data);
};

type UseUpdateOrderOptions = {
  mutationConfig?: MutationConfig<typeof updateOrder>;
};

export const useUpdateOrder = ({
  mutationConfig,
}: UseUpdateOrderOptions = {}) => {
  const queryClient = useQueryClient();
  const { track } = useAnalytics();
  const { onSuccess, ...restConfig } = mutationConfig || {};
  const { data: servicesData } = useServices();

  return useMutation({
    onSuccess: (response, variables, context) => {
      // Track order update events for blood draw scheduling
      const order = response.order;

      const service = servicesData?.services?.find(
        (s) => s.id === order.serviceId,
      );

      track('order_updated', {
        order_id: order.id,
        order_invoice_id: order.invoiceId,
        order_name: order.name,
        order_status: order.status,
        order_collection_method: order.method?.[0],
        service_id: order.serviceId,
        service_name: order.serviceName,
        is_blood_panel: isBloodPanel(order.serviceName),
        value: service?.price,
        currency: 'USD',
      });

      queryClient.invalidateQueries({
        queryKey: getOrdersQueryOptions().queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: getTimelineQueryOptions().queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: getServicesQueryOptions().queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: ['service'],
      });
      onSuccess?.(response, variables, context);
    },
    ...restConfig,
    mutationFn: updateOrder,
  });
};
