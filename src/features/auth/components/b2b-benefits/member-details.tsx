import { useFormContext } from 'react-hook-form';

import { useCheckoutContext } from '@/features/auth/stores';
import { RegisterInput } from '@/lib/auth';

import { YourDetailsSection } from '../configurator/sections';

import { BenefitDetailsLayout } from './benefit-details-layout';

interface MemberDetailsProps {
  onPrev: () => void;
  onSubmit: (data: RegisterInput) => Promise<void>;
}

const MemberDetails = ({ onPrev, onSubmit }: MemberDetailsProps) => {
  const processing = useCheckoutContext((s) => s.processing);
  const form = useFormContext<RegisterInput>();

  return (
    <BenefitDetailsLayout
      onPrev={onPrev}
      processing={processing}
      submitDisabled={processing}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <YourDetailsSection
        emailDisabled={false}
        showAtHomeNoticeAlert={false}
        showGenderField
      />
    </BenefitDetailsLayout>
  );
};

export { MemberDetails };
