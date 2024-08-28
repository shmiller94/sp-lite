import { X } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Body1 } from '@/components/ui/typography';
import { useOnboarding } from '@/features/onboarding/stores/onboarding-store';
import { HealthcareServiceDetails } from '@/shared/components';
import { HealthcareService } from '@/types/api';

export const HealthcareCardDialog = ({
  healthcareService,
}: {
  healthcareService: HealthcareService;
}) => {
  const { addAdditionalService, increaseOrderTotal } = useOnboarding();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <a
          href="#"
          className="text-sm leading-5 text-[#FC5F2B]"
          onClick={(e) => e.stopPropagation()}
        >
          More info
        </a>
      </DialogTrigger>
      <DialogContent>
        <div className="max-h-[90vh] overflow-y-scroll rounded-xl">
          <div>
            <div className="flex flex-row items-center justify-between bg-[#F7F7F7] px-12 pb-6 pt-12">
              <Body1 className="text-zinc-500">Service</Body1>
              <DialogClose>
                <X className="size-6 cursor-pointer p-1" />
              </DialogClose>
            </div>
            <HealthcareServiceDetails healthcareService={healthcareService}>
              <DialogClose>
                <Button
                  onClick={() => {
                    increaseOrderTotal(healthcareService.price);
                    addAdditionalService(healthcareService);
                  }}
                >
                  Add to cart
                </Button>
              </DialogClose>
            </HealthcareServiceDetails>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
