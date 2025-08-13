import { ring2 } from 'ldrs';

/**
 * If we don't have that, components that are using Spinner fail due to: Invalid string length
 * For now we will disable register for testing and will investigate later.
 */
if (!import.meta.env.TEST) {
  ring2.register();
}

const sizes = {
  xs: 16,
  sm: 24,
  md: 32,
  lg: 64,
  xl: 96,
};

const variants = {
  light: 'white',
  primary: '#18181B',
};

export type SpinnerProps = {
  size?: keyof typeof sizes;
  variant?: keyof typeof variants;
};

export const Spinner = ({ size = 'sm', variant = 'light' }: SpinnerProps) => {
  const strokeWidth = 3;
  const radius = sizes[size] / 2 - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${circumference * 0.25} ${circumference * 0.75}`;

  return (
    <>
      <svg width={sizes[size]} height={sizes[size]} className="relative">
        {/* Background circle - full circle with low opacity */}
        <circle
          cx={sizes[size] / 2}
          cy={sizes[size] / 2}
          r={radius}
          fill="none"
          stroke={variants[variant]}
          strokeWidth={strokeWidth}
          opacity={0.1}
        />
        {/* Spinning arc with rounded caps */}
        <circle
          cx={sizes[size] / 2}
          cy={sizes[size] / 2}
          r={radius}
          fill="none"
          stroke={variants[variant]}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
          strokeDashoffset={circumference * 0.75}
          className="origin-center transform-gpu animate-spin-safe will-change-transform"
          style={{
            transformOrigin: `${sizes[size] / 2}px ${sizes[size] / 2}px`,
          }}
        />
      </svg>

      <span className="sr-only">Loading</span>
    </>
  );
};
