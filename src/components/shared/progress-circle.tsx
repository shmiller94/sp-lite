import { m } from 'framer-motion';
import { Fragment, useMemo } from 'react';
import type { ReactNode } from 'react';

import NumberFlow from '@/components/shared/number-flow';
import { H1 } from '@/components/ui/typography';

const STROKE_LENGTH = 6;

type BorderCircle = {
  strokeWidth: number;
  lgStrokeWidth?: number;
  color: string;
  blur: string;
};

type ProgressCircleProps = {
  value: number;
  animate?: boolean;
  currentStep?: number;
  totalSteps?: number;
  reserve?: number;
  animationDuration?: number;
  easing?: string;
  progressMax?: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  borderCircles?: BorderCircle[];
  children?: ReactNode;
};

export const ProgressCircle = ({
  value,
  animate = true,
  currentStep = 0,
  totalSteps = 0,
  reserve = 0,
  animationDuration = 1000,
  easing = 'cubic-bezier(0.16, 1, 0.3, 1)',
  progressMax,
  size = 400,
  strokeWidth = 2,
  className = '',
  borderCircles = [],
  children,
}: ProgressCircleProps) => {
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

  const displayValue = animate && totalSteps > 0 ? stepValue : targetValue;

  const circle = useMemo(() => {
    const tickGap = 8;
    const tickLength = STROKE_LENGTH;
    const r = (size - strokeWidth) / 2 - (tickGap + tickLength + 1);
    const c = 2 * Math.PI * r;
    return { size, r, c, strokeWidth, tickGap, tickLength } as const;
  }, [size, strokeWidth]);

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

  const dashOffset = useMemo(() => {
    const c = 2 * Math.PI * 139;
    return c * (1 - targetProgress);
  }, [targetProgress]);

  const motionVariants = {
    hidden: { strokeDashoffset: 2 * Math.PI * 139 },
    visible: { strokeDashoffset: dashOffset },
  };

  return (
    <div
      className={`pointer-events-none relative flex items-center justify-center ${className}`}
    >
      {borderCircles.map((border, index) => (
        <Fragment key={`fragment-${index}-mobile`}>
          <m.svg
            key={`border-${index}-mobile`}
            className={`absolute left-1/2 top-1/2 size-80 -translate-x-1/2 -translate-y-1/2 ${border.blur} lg:hidden`}
            style={{ mixBlendMode: 'plus-lighter' }}
            viewBox="0 0 320 320"
            aria-hidden
            initial={animate ? 'hidden' : 'visible'}
            animate="visible"
            variants={motionVariants}
            transition={{
              duration: animationDuration / 1000,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <m.circle
              cx={160}
              cy={160}
              r={139}
              fill="none"
              stroke={border.color}
              strokeWidth={border.strokeWidth}
              strokeDasharray={2 * Math.PI * 139}
              strokeLinecap="round"
              style={{
                transform: 'rotate(-90deg)',
                transformOrigin: '50% 50%',
              }}
            />
          </m.svg>
          <m.svg
            key={`border-${index}-desktop`}
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:size-[356px] ${border.blur} hidden lg:block`}
            style={{ mixBlendMode: 'plus-lighter' }}
            viewBox="0 0 356 356"
            aria-hidden
            initial={animate ? 'hidden' : 'visible'}
            animate="visible"
            variants={{
              hidden: { strokeDashoffset: 2 * Math.PI * 177 },
              visible: {
                strokeDashoffset: 2 * Math.PI * 177 * (1 - targetProgress),
              },
            }}
            transition={{
              duration: animationDuration / 1000,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <m.circle
              cx={178}
              cy={178}
              r={177}
              fill="none"
              stroke={border.color}
              strokeWidth={border.lgStrokeWidth || border.strokeWidth}
              strokeDasharray={2 * Math.PI * 177}
              strokeLinecap="round"
              style={{
                transform: 'rotate(-90deg)',
                transformOrigin: '50% 50%',
              }}
            />
          </m.svg>
        </Fragment>
      ))}
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
