import { createFileRoute, Link, notFound } from '@tanstack/react-router';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Spinner } from '@/components/ui/spinner';
import { PurchaseDialog } from '@/features/orders/components/purchase';
import { useServices } from '@/features/services/api';

export const Route = createFileRoute('/_app/services/$id')({
  component: ServiceComponent,
});

function ServiceComponent() {
  const { id } = Route.useParams();
  const navigate = Route.useNavigate();

  const { data, isError, isLoading } = useServices();

  const service = data?.services?.find((s) => s.id === id);

  if (isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner variant="primary" size="lg" />
      </div>
    );
  }

  if (isError || !service) {
    throw notFound();
  }

  return (
    <div className="mx-auto w-full max-w-3xl py-9">
      <ServiceBreadcrumb className="px-6 md:px-16" service={service.name} />
      <PurchaseDialog
        healthcareService={service}
        onClose={() => void navigate({ to: '/marketplace' })}
      />
    </div>
  );
}

interface ServiceBreadcrumbProps {
  className?: string;
  service: string;
}

const ServiceBreadcrumb = ({ className, service }: ServiceBreadcrumbProps) => {
  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/marketplace">Marketplace</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>{service}</BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};
