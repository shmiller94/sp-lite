import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useProducts } from '@/features/action-plan/api';
import { HealthcareServiceDialog } from '@/features/orders/components/healthcare-service-dialog';
import { useServices } from '@/features/services/api';
import { PlanGoalItem } from '@/types/api';

export const PlanItemList = ({ item }: { item: PlanGoalItem }) => {
  const servicesQuery = useServices();
  const productsQuery = useProducts();

  switch (item.itemType) {
    case 'PRODUCT': {
      const product = productsQuery.data?.products.find(
        (product) => product.id === item.itemId,
      );

      // Shopify item is found
      if (product !== undefined) {
        return (
          <li className="text-base text-vermillion-900">
            <span className="text-zinc-600">
              <a
                href={product.url}
                className="cursor-pointer text-vermillion-900 hover:text-vermillion-500"
                target="_blank"
                rel="noreferrer"
              >
                {product.name}
              </a>
              <span> {item.description ? `- ${item.description}` : null}</span>
            </span>
          </li>
        );
      }

      // Shopify Item is missing
      if (item.title !== null) {
        return (
          <li className="text-base text-vermillion-900">
            <span className="text-zinc-600">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-default text-vermillion-900 hover:text-vermillion-500">
                      {item.title}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Product not currently available.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <span> {item.description ? `- ${item.description}` : null}</span>
            </span>
          </li>
        );
      }

      // Shopify item is missing and name was not saved
      return null;
    }
    case 'SERVICE': {
      const service = servicesQuery.data?.services.find(
        (service) => service.id === item.itemId,
      );

      return service ? (
        <li className="text-base text-vermillion-900">
          <span className="text-zinc-600">
            <HealthcareServiceDialog healthcareService={service}>
              <span className="text-vermillion-900 hover:text-vermillion-500">
                {service.name}&nbsp;
              </span>
            </HealthcareServiceDialog>
            {item.description ? `- ${item.description}` : null}
          </span>
        </li>
      ) : null;
    }
  }
};
