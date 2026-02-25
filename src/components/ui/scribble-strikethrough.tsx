import { m, useAnimationControls } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface ScribbleStrikethroughProps {
  isVisible: boolean;
  variant?: 'wavy' | 'loose';
  className?: string;
  color?: string;
  strokeWidth?: number;
  duration?: number;
}

// Two scribble path variants
const SCRIBBLE_PATHS = {
  wavy: {
    viewBox: '0 0 190 14',
    path: 'M1 10.7837C1.4997 10.4299 3.04392 8.96649 7.8058 6.21276C18.3996 0.0864904 23.1711 0.616216 26.8595 1.60923C31.0681 2.74226 34.6978 5.68547 39.1687 7.07792C41.9987 7.9593 46.1229 8.70562 56.8349 9.54673C67.5469 10.3878 84.7612 11.1759 93.7575 11.8056C104.361 12.5479 107.007 13.7399 113.025 12.3785C118.269 11.1923 127.839 8.54526 133.603 7.2238C139.366 5.90234 141.002 5.87028 141.965 6.1093C146.354 7.19815 153.214 10.9121 160.91 11.2857C167.265 10.0678 178.383 7.71041 183.901 7.44863C186.121 7.3205 187.162 7.20196 189 6.94604',
  },
  loose: {
    viewBox: '0 0 171 11',
    path: 'M1 3.77997C1.03372 3.77997 4.8439 3.72649 12.6175 3.21001C16.6163 2.94433 20.6522 1.87613 25.2066 1.39814C29.7611 0.920142 34.6934 0.861424 42.4096 1.5666C50.1258 2.27178 60.4764 3.74263 67.5607 5.21483C78.3101 7.44868 82.2567 9.6918 84.626 9.83959C89.7231 10.1575 95.4678 9.35604 103.228 7.44056C108.609 6.11214 116.823 3.67402 121.525 2.40634C128.701 0.471432 131.601 1.6791 134.669 2.89563C137.807 4.1392 145.59 4.22877 154.871 4.22187C163.072 3.38967 166.051 2.1913 167.06 1.76078C167.544 1.54303 167.973 1.32676 169.572 1',
  },
};

export const ScribbleStrikethrough = ({
  isVisible,
  variant = 'wavy',
  className = '',
  color = '#FC5F2B',
  strokeWidth = 2,
  duration = 0.4,
}: ScribbleStrikethroughProps) => {
  const scribble = SCRIBBLE_PATHS[variant];
  const svgControls = useAnimationControls();
  const pathControls = useAnimationControls();
  const prevVisible = useRef<boolean | null>(null);

  useEffect(() => {
    if (prevVisible.current === null) {
      svgControls.set({ opacity: 0, filter: 'blur(0px)' });
      pathControls.set({ pathLength: 0 });
      prevVisible.current = isVisible;
      if (!isVisible) return;
    }

    const wasVisible = prevVisible.current;
    prevVisible.current = isVisible;

    if (isVisible && !wasVisible) {
      // Showing: fade in SVG quickly, then draw the path
      svgControls.set({ opacity: 1, filter: 'blur(0px)' });
      pathControls.set({ pathLength: 0 });
      pathControls.start({
        pathLength: 1,
        transition: { duration, ease: 'easeInOut' },
      });
    } else if (!isVisible && wasVisible) {
      // Hiding: blur and fade out, then reset path after animation
      svgControls
        .start({
          opacity: 0,
          filter: 'blur(4px)',
          transition: { duration: duration * 0.5 },
        })
        .then(() => {
          // Reset path after fade completes so it's ready for next draw
          pathControls.set({ pathLength: 0 });
        });
    }
  }, [isVisible, duration, svgControls, pathControls]);

  return (
    <m.svg
      className={`pointer-events-none absolute inset-x-0 top-1/2 h-[14px] w-full -translate-y-1/2 ${className}`}
      viewBox={scribble.viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      initial={{ opacity: 0, filter: 'blur(0px)' }}
      animate={svgControls}
    >
      <m.path
        d={scribble.path}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={pathControls}
      />
    </m.svg>
  );
};
