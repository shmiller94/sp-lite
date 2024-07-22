// import { useState } from 'react';

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';

// import { useVerifyOtp } from '../api/verify-otp';

export type OtpFormProps = {
  numSlots: number;
  onSubmit: (value: string) => void;
  error?: boolean;
};

export function OtpForm(props: OtpFormProps): JSX.Element {
  const { numSlots, onSubmit } = props;

  // const [isInvalid, setIsInvalid] = useState<boolean>(false);
  // const verifyOtpMutation = useVerifyOtp({
  //   mutationConfig: {
  //     onSuccess: () => {},
  //     onError: () => {
  //       setIsInvalid(true);
  //     },
  //   },
  // });

  // const onSubmitOtp = (otp: string) => {
  //   verifyOtpMutation.mutateAsync({ data: { otp } });
  // };

  const onChange = (value: string) => {
    if (value.length === 5) {
      onSubmit(value);
    }
  };

  return (
    <div className="flex justify-center">
      <InputOTP maxLength={numSlots} onChange={onChange}>
        <InputOTPGroup>
          {[...Array(numSlots).keys()].map((i) => (
            <InputOTPSlot key={i} index={i} className="bg-white/5" />
          ))}
        </InputOTPGroup>
      </InputOTP>
    </div>
  );
}
