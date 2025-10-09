import { LabeledCheckbox } from '@/components/shared/labeled-checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Body2, H2 } from '@/components/ui/typography';
import { HealthcareServiceFooter } from '@/features/orders/components/healthcare-service-footer';
import { HEALTHCARE_SERVICE_DIALOG_CONTAINER_STYLE } from '@/features/orders/const/config';
import { useOrder } from '@/features/orders/stores/order-store';
import { cn } from '@/lib/utils';
import {
  getDefaultAgreementCopyForService,
  getInformedConsentForService,
} from '@/utils/service';

export const InformedConsent = () => {
  const service = useOrder((s) => s.service);
  const updateInformedConsent = useOrder((s) => s.updateInformedConsent);
  const informedConsent = useOrder((s) => s.informedConsent);

  const informedConsentText = getInformedConsentForService(service.name);
  const defaultAgreementCopy = getDefaultAgreementCopyForService(service.name);

  return (
    <>
      <div
        className={cn('space-y-8', HEALTHCARE_SERVICE_DIALOG_CONTAINER_STYLE)}
      >
        <div className="space-y-4">
          <H2 className="text-2xl md:text-3xl">Informed Consent</H2>
          <ScrollArea className="bg-white md:max-h-[220px] md:overflow-y-scroll md:rounded-[20px] md:border md:border-zinc-200">
            <div className="md:p-6">
              <Body2 className="text-zinc-500">{informedConsentText}</Body2>
            </div>
          </ScrollArea>
        </div>
        <div className="flex items-start justify-start gap-4">
          <LabeledCheckbox
            id="legal"
            checked={informedConsent ?? false}
            onCheckedChange={updateInformedConsent}
            label={defaultAgreementCopy}
          />
        </div>
      </div>
      <HealthcareServiceFooter nextBtnDisabled={!informedConsent} />
    </>
  );
};
