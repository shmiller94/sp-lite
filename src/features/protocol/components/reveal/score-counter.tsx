import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';

import NumberFlow from '@/components/shared/number-flow';
import { H1 } from '@/components/ui/typography';

const STROKE_LENGTH = 6;

type ScoreCounterProps = {
  value: number;
  animate?: boolean;
  currentStep?: number;
  totalSteps?: number;
  reserve?: number;
  animationDuration?: number;
  easing?: string;
  // If provided and > 0, the circle progress will reflect value/progressMax
  // instead of step-based progress. Useful for percentage-like values.
  progressMax?: number;
  children?: ReactNode;
};

export const ScoreCounter = ({
  value,
  animate = true,
  currentStep = 0,
  totalSteps = 0,
  reserve = 0,
  animationDuration = 300,
  easing = 'ease-out',
  progressMax,
  children,
}: ScoreCounterProps) => {
  const targetValue = value ?? 0;

  const stepValue = useMemo(() => {
    const steps = Math.max(0, totalSteps);
    const k = Math.min(Math.max(0, currentStep), steps > 0 ? steps - 1 : 0);
    if (steps === 0) return 0;
    const isFinal =
      steps > 0 && Math.min(Math.max(0, currentStep), steps - 1) >= steps - 1;
    if (isFinal) return targetValue;

    const reserveAmt = Math.max(0, reserve);
    const cappedTarget = Math.max(0, targetValue - reserveAmt);
    const denom = Math.max(1, steps - 1);
    const base = Math.floor(cappedTarget / denom);
    const rem = cappedTarget % denom;

    return base * k + Math.min(k, rem);
  }, [currentStep, totalSteps, targetValue, reserve]);

  // Use step-based value only when a multi-step sequence is provided
  const displayValue = animate && totalSteps > 0 ? stepValue : targetValue;

  // Geometry constants for the ring
  const circle = useMemo(() => {
    const size = 400;
    const strokeWidth = 2;
    const tickGap = 8;
    const tickLength = STROKE_LENGTH;
    const r = (size - strokeWidth) / 2 - (tickGap + tickLength + 1);
    const c = 2 * Math.PI * r;
    return { size, r, c, strokeWidth, tickGap, tickLength } as const;
  }, []);

  // Compute target progress based on steps or value
  const targetProgress = useMemo(() => {
    const steps = Math.max(0, totalSteps);
    const cappedIdx =
      steps > 0 ? Math.min(Math.max(0, currentStep), steps - 1) : 0;
    const isFinal = steps > 0 && cappedIdx >= Math.max(0, steps - 1);

    if (steps > 0) {
      if (steps > 1) return isFinal ? 1 : cappedIdx / (steps - 1);
      return 1;
    }
    if (progressMax && progressMax > 0) {
      const pct = targetValue / progressMax;
      return Math.max(0, Math.min(1, pct));
    }
    return targetValue > 0 ? 1 : 0;
  }, [totalSteps, currentStep, targetValue, progressMax]);

  // Animate ring from 0 -> targetProgress on mount/updates when animate=true
  const isStepMode = totalSteps > 0;
  const [progress, setProgress] = useState<number>(
    animate ? (isStepMode ? targetProgress : 0) : targetProgress,
  );
  const rafRef = useRef<number | null>(null);
  useEffect(() => {
    if (!animate) {
      setProgress(targetProgress);
      return;
    }
    // In step mode, jump directly to target; transitions will animate between steps.
    if (isStepMode) {
      setProgress(targetProgress);
      return;
    }
    // In value mode, animate from 0 to target on mount/update.
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => setProgress(targetProgress));
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [targetProgress, animate, isStepMode]);

  const dashOffset = circle.c * (1 - progress);
  const transition = animate
    ? `stroke-dashoffset ${animationDuration}ms ${easing}`
    : 'none';

  return (
    <div className="pointer-events-none relative flex size-72 items-center justify-center text-white md:size-[512px]">
      <svg
        className="absolute inset-0 size-full"
        viewBox={`0 0 ${circle.size} ${circle.size}`}
        aria-hidden
      >
        {(() => {
          const cx = circle.size / 2;
          const cy = circle.size / 2;
          const gap = circle.tickGap;
          const tickLength = circle.tickLength;
          const innerR = circle.r + gap;
          const desiredSpacingPx = 8;
          const approxCircumference = 2 * Math.PI * innerR;
          const tickCount = Math.max(
            120,
            Math.round(approxCircumference / desiredSpacingPx),
          );
          const outerR = innerR + tickLength;
          const ticks = Array.from({ length: tickCount }, (_, i) => {
            const theta = (i / tickCount) * Math.PI * 2;
            const cos = Math.cos(theta);
            const sin = Math.sin(theta);
            const x1 = cx + innerR * cos;
            const y1 = cy + innerR * sin;
            const x2 = cx + outerR * cos;
            const y2 = cy + outerR * sin;
            return { x1, y1, x2, y2, key: i };
          });
          return (
            <g className="text-white/50">
              {ticks.map((t) => (
                <line
                  key={t.key}
                  x1={t.x1}
                  y1={t.y1}
                  x2={t.x2}
                  y2={t.y2}
                  stroke="currentColor"
                  strokeWidth={1}
                  strokeLinecap="round"
                />
              ))}
            </g>
          );
        })()}
        <circle
          cx={circle.size / 2}
          cy={circle.size / 2}
          r={circle.r}
          fill="none"
          stroke="currentColor"
          className="text-white"
          strokeWidth={circle.strokeWidth}
          strokeDasharray={circle.c}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          style={{
            transition,
            willChange: 'stroke-dashoffset',
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%',
          }}
        />
      </svg>
      <div className="relative z-10 flex flex-col items-center">
        <H1 className="text-5xl font-semibold text-white drop-shadow-sm md:text-[96px]">
          {animate ? (
            <NumberFlow
              value={displayValue}
              duration={animationDuration}
              easing={easing}
              format={{
                minimumIntegerDigits: 2,
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              }}
            />
          ) : (
            <span className="tracking-wide">
              {new Intl.NumberFormat(undefined, {
                minimumIntegerDigits: 2,
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              }).format(displayValue)}
            </span>
          )}
        </H1>
        {children}
      </div>
    </div>
  );
};
