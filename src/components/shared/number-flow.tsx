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
  const initialCounter = initialValue ?? 0;
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const counter: Value = hasMounted ? value : initialCounter;

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
