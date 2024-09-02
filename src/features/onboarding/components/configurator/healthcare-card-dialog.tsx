import React from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogTrigger } from '@/components/ui/dialog';
import { useOnboarding } from '@/features/onboarding/stores/onboarding-store';
import { HealthcareServiceDialogContent } from '@/shared/components';
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

      <HealthcareServiceDialogContent healthcareService={healthcareService}>
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
      </HealthcareServiceDialogContent>
    </Dialog>
  );
};
