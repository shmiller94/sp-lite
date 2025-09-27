import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { isBloodPanel } from '@/const/services';
import { getTimelineQueryOptions } from '@/features/home/api/get-timeline';
import { getOrdersQueryOptions } from '@/features/orders/api/get-orders';
import { getServicesQueryOptions, useServices } from '@/features/services/api';
import { useAnalytics } from '@/hooks/use-analytics';
import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { addressInputSchema } from '@/types/address';
import { Order } from '@/types/api';

export const serviceItemInputSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number(),
});

export type ServiceInput = z.infer<typeof serviceItemInputSchema>;

export const webAddressInputSchema = z.object({
  url: z.string().min(1),
  type: z.enum(['ZOOM']),
});

export type WebAddressInput = z.infer<typeof webAddressInputSchema>;

export const locationInputSchema = z.object({
  name: z.string().optional(),
  isDefault: z.boolean().optional(),
  address: addressInputSchema.optional(),
  webAddress: webAddressInputSchema.optional(),
});

export type LocationInput = z.infer<typeof locationInputSchema>;

export const consentInputSchema = z.object({
  agreedAt: z.string(), // You can store `agreedAt` as a string (ISO date format)
});

export const createOrderInputSchema = z.object({
  id: z.string().optional(),
  serviceId: z.string().min(1, 'This is required.'),
  items: z.array(serviceItemInputSchema).optional(),
  location: locationInputSchema,
  timestamp: z.string().min(1, 'This is required.'),
  externalId: z.string().optional(),
  timezone: z.string().min(1, 'This is required.'),
  method: z.array(z.enum(['AT_HOME', 'IN_LAB', 'PHLEBOTOMY_KIT', 'EVENT'])),
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
  informedConsent: consentInputSchema.optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderInputSchema>;

export const createOrder = ({
  data,
}: {
  data: CreateOrderInput;
}): Promise<{ order: Order }> => {
  return api.post('/orders', data);
};

type UseCreateOrderOptions = {
  mutationConfig?: MutationConfig<typeof createOrder>;
};

export const useCreateOrder = ({
  mutationConfig,
}: UseCreateOrderOptions = {}) => {
  const queryClient = useQueryClient();
  const { track } = useAnalytics();
  const { onSuccess, ...restConfig } = mutationConfig || {};
  const { data: servicesData } = useServices();

  return useMutation({
    onSuccess: (response, variables, context) => {
      // Track order events
      const order = response.order;
      const service = servicesData?.services?.find(
        (s) => s.id === order.serviceId,
      );

      track('order_created', {
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
      // https://tanstack.com/query/latest/docs/framework/react/guides/query-invalidation#query-matching-with-invalidatequeries
      // we want to invalidate ALL service queries here
      queryClient.invalidateQueries({
        queryKey: ['service'],
      });

      onSuccess?.(response, variables, context);
    },
    ...restConfig,
    mutationFn: createOrder,
  });
};
