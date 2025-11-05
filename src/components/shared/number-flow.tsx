import NumberFlowRaw from '@number-flow/react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const MotionNumberFlow = motion(NumberFlowRaw);

export default function NumberFlow({
  value,
  initialValue,
  trend,
  className,
}: {
  value: number;
  initialValue?: number;
  trend?: 'up' | 'down';
  className?: string;
}) {
  const [counter, setCounter] = useState<number>(initialValue ?? 0);

  // Only update the counter after first render
  useEffect(() => {
    setCounter(value);
  }, [value]);

  return (
    <MotionNumberFlow
      className={className}
      value={counter}
      trend={trend === 'up' ? 1 : trend === 'down' ? -1 : 0}
    />
  );
}
