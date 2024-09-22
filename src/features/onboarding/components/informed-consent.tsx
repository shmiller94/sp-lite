import { X } from 'lucide-react';
import * as React from 'react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Body1, Body2, H2 } from '@/components/ui/typography';
import { GRAIL_GALLERI_MULTI_CANCER_TEST } from '@/const';
import { useOnboarding } from '@/features/onboarding/stores/onboarding-store';
import { HealthcareService } from '@/types/api';
import { getInformedConsentForService } from '@/utils/service';

export const InformedConsent = ({
  healthcareService,
}: {
  healthcareService: HealthcareService;
}) => {
  const { updateAdditionalService, slots, additionalServices } = useOnboarding(
    (s) => s,
  );

  if (healthcareService.name !== GRAIL_GALLERI_MULTI_CANCER_TEST) {
    return;
  }

  const isOpen =
    additionalServices.find((s) => s.name === healthcareService.name) !==
      undefined && !slots.cancer.agreedToConsent;

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <div className="max-h-[90vh] overflow-y-scroll rounded-xl">
          <div>
            <div className="flex flex-row items-center justify-between px-12 pb-6 pt-12">
              <Body1 className="text-zinc-500">Confirm Grail Test</Body1>
              <AlertDialogCancel
                onClick={() => updateAdditionalService(healthcareService)}
              >
                <X className="size-6 cursor-pointer p-1" />
              </AlertDialogCancel>
            </div>
            <div className="p-12">
              <InformedConsentContent />
            </div>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const InformedConsentContent = () => {
  const disclaimer = getInformedConsentForService(
    GRAIL_GALLERI_MULTI_CANCER_TEST,
  );

  const { updateCancerAgreement, slots } = useOnboarding((s) => s);

  const [agreed, setAgreed] = useState<boolean>(slots.cancer.agreedToConsent);

  return (
    <>
      <div className="space-y-8 md:space-y-12">
        <div className="space-y-4">
          <H2 className="text-2xl md:text-3xl">Disclaimer</H2>
          <ScrollArea className="md:max-h-[220px] md:overflow-y-scroll md:rounded-[20px] md:border md:border-zinc-200">
            <div className="md:p-6">
              <Body2 className="text-zinc-500">{disclaimer}</Body2>
            </div>
          </ScrollArea>
        </div>
        <div className="flex items-start justify-start gap-4">
          <Checkbox
            checked={agreed}
            onCheckedChange={() => setAgreed((prev) => !prev)}
          />
          <Body2 className="leading-normal text-zinc-500">
            By continuing, I acknowledge my understanding and acceptance of the
            above information.
          </Body2>
        </div>
      </div>
      {/*Mobile button*/}
      <div className="py-3 pb-[38px] pt-8 md:hidden">
        <Button
          className="w-full"
          disabled={!agreed}
          onClick={() => updateCancerAgreement(true)}
        >
          Next
        </Button>
      </div>

      {/*Desktop button*/}
      <div className="mt-12 hidden items-center justify-between md:flex">
        <Button disabled={!agreed} onClick={() => updateCancerAgreement(true)}>
          Next
        </Button>
      </div>
    </>
  );
};
