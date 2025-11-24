import NumberFlowRaw from '@number-flow/react';
import { useEffect, useState } from 'react';

type RawProps = React.ComponentProps<typeof NumberFlowRaw>;
type Value = RawProps['value'];

type NumberFlowProps = RawProps & {
  initialValue?: number;
  duration?: number;
  easing?: string;
};

export default function NumberFlow({
  value,
  initialValue,
  duration,
  easing,
  className,
  ...rest
}: NumberFlowProps) {
  const [counter, setCounter] = useState<Value>(initialValue ?? 0);

  // Only update the counter after first render
  useEffect(() => {
    setCounter(value);
  }, [value]);

  return (
    <NumberFlowRaw
      className={className}
      value={counter}
      transformTiming={
        duration ? { duration, easing: easing ?? 'ease-out' } : undefined
      }
      {...rest}
    />
  );
}
