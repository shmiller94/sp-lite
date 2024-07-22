import { useState } from 'react';

import { useSendOtp } from '../api/send-otp';
// import { useVerifyOtp } from '../api/verify-otp';

import { OtpForm } from './otp-form';
import { PhoneForm } from './phone-form';

// export type TwoFactorFormProps = {
//   onValidated: () => void;
// };

// export function TwoFactorForm(props: TwoFactorFormProps): JSX.Element {
export function TwoFactorForm(): JSX.Element {
  const [otpSent, setOtpSent] = useState<boolean>(false);
  // const [isInvalid, setIsInvalid] = useState<boolean>(false);
  const sendOtpMutation = useSendOtp({
    mutationConfig: {
      onSuccess: () => {
        setOtpSent(true);
      },
      onError: () => {
        setOtpSent(false);
      },
    },
  });

  const onSubmitPhone = (phone: string) => {
    console.log(phone);
    sendOtpMutation.mutateAsync({ data: {} });
  };

  const onSubmitOtp = () => {};

  return (
    <>
      {otpSent === false && <PhoneForm onSubmit={onSubmitPhone} />}
      {otpSent === true && <OtpForm onSubmit={onSubmitOtp} numSlots={5} />}
    </>
  );
}
