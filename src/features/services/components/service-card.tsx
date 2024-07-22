import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

import { useService } from '../api/get-service';

export const ServiceCard = ({ serviceId }: { serviceId: string }) => {
  const serviceQuery = useService({
    serviceId,
  });

  if (serviceQuery.isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!serviceQuery.data) return null;

  return (
    <div className="group relative">
      <div className="flex h-full flex-col space-y-2 rounded-[20px] bg-[#F7F7F7] p-2">
        <div className="aspect-[225/172] rounded-[20px] bg-white">
          <img
            src={`/src/assets/services/${serviceQuery.data.name.replaceAll(' ', '_').toLowerCase().trim()}.png`}
            alt={serviceQuery.data.name}
            className="rounded-[16px]"
          />
        </div>
        <div className="space-y-1 p-4">
          <p className="line-clamp-1 text-xl leading-7">
            {serviceQuery.data.name}
          </p>
          <p className="line-clamp-3 text-[#A1A1A1]">
            {serviceQuery.data.description}
          </p>
        </div>
      </div>
      <div className="absolute bottom-3 right-3 opacity-0 transition-opacity group-hover:opacity-100">
        <Button className="rounded-full p-2.5">
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
};
