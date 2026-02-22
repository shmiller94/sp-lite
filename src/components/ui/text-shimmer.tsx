import { m } from 'framer-motion';
import React from 'react';

import { cn } from '@/lib/utils';

type TextShimmerAs =
  | 'div'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'p'
  | 'span';

interface TextShimmerProps {
  children: string;
  as?: TextShimmerAs;
  className?: string;
  duration?: number;
  spread?: number;
}

export function TextShimmer({
  children,
  as: Component = 'p',
  className,
  duration = 2,
  spread = 2,
}: TextShimmerProps) {
  const dynamicSpread = children.length * spread;
  const style = {
    '--spread': `${dynamicSpread}px`,
    backgroundImage: `var(--bg), linear-gradient(var(--base-color), var(--base-color))`,
  } as React.CSSProperties;

  const shimmerClassName = cn(
    'relative inline-block bg-[length:250%_100%,auto] bg-clip-text',
    'text-transparent [--base-color:#a1a1aa] [--base-gradient-color:#000]',
    '[--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--base-gradient-color),#0000_calc(50%+var(--spread)))] [background-repeat:no-repeat,padding-box]',
    'dark:[--base-color:#71717a] dark:[--base-gradient-color:#ffffff] dark:[--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--base-gradient-color),#0000_calc(50%+var(--spread)))]',
    className,
  );

  const ease = 'linear' as const;

  const motionProps = {
    className: shimmerClassName,
    initial: { backgroundPosition: '100% center' },
    animate: { backgroundPosition: '0% center' },
    transition: {
      repeat: Infinity,
      duration,
      ease,
    },
    style,
    children,
  };

  switch (Component) {
    case 'div':
      return <m.div {...motionProps} />;
    case 'h1':
      return <m.h1 {...motionProps} />;
    case 'h2':
      return <m.h2 {...motionProps} />;
    case 'h3':
      return <m.h3 {...motionProps} />;
    case 'h4':
      return <m.h4 {...motionProps} />;
    case 'h5':
      return <m.h5 {...motionProps} />;
    case 'h6':
      return <m.h6 {...motionProps} />;
    case 'span':
      return <m.span {...motionProps} />;
    case 'p':
      return <m.p {...motionProps} />;
  }
}
