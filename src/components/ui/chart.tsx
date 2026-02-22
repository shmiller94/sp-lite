import * as React from 'react';

import { cn } from '@/lib/utils';

interface Themes {
  light: string;
  dark: string;
}

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES: Themes = { light: '', dark: '.dark' };

interface ChartConfigItemBase {
  label?: React.ReactNode;
  icon?: React.ComponentType;
}

interface ChartConfigItemWithColor extends ChartConfigItemBase {
  color?: string;
  theme?: undefined;
}

interface ChartConfigItemWithTheme extends ChartConfigItemBase {
  color?: undefined;
  theme: Record<keyof Themes, string>;
}

export interface ChartConfig {
  [k: string]: ChartConfigItemWithColor | ChartConfigItemWithTheme;
}

interface ChartContainerProps extends React.ComponentProps<'div'> {
  config: ChartConfig;
  children: React.ReactElement;
}

const LazyResponsiveContainer = React.lazy(async () => {
  const mod = await import('recharts');
  return { default: mod.ResponsiveContainer };
});

export const ChartContainer = React.forwardRef<
  HTMLDivElement,
  ChartContainerProps
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId();
  const chartId = `chart-${id ?? uniqueId.replace(/:/g, '')}`;

  return (
    <div
      data-chart={chartId}
      ref={ref}
      className={cn(
        "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
        className,
      )}
      {...props}
    >
      <ChartStyle id={chartId} config={config} />
      <React.Suspense fallback={<div className="size-full" />}>
        <LazyResponsiveContainer>{children}</LazyResponsiveContainer>
      </React.Suspense>
    </div>
  );
});
ChartContainer.displayName = 'ChartContainer';

function ChartStyle({ id, config }: { id: string; config: ChartConfig }) {
  const keysWithColor: string[] = [];

  for (const key of Object.keys(config)) {
    const itemConfig = config[key];
    if (itemConfig == null) continue;

    if (itemConfig.color != null && itemConfig.color !== '') {
      keysWithColor.push(key);
      continue;
    }

    if (itemConfig.theme != null) {
      keysWithColor.push(key);
    }
  }

  if (keysWithColor.length === 0) {
    return null;
  }

  const themeNames: Array<keyof Themes> = ['light', 'dark'];

  let css = '';
  for (const themeName of themeNames) {
    const prefix = THEMES[themeName];
    css += `\n${prefix} [data-chart=${id}] {\n`;

    for (const key of keysWithColor) {
      const itemConfig = config[key];
      if (itemConfig == null) continue;

      const color = itemConfig.theme?.[themeName] ?? itemConfig.color;
      if (color == null || color === '') continue;

      css += `  --color-${key}: ${color};\n`;
    }

    css += '}\n';
  }

  return <style>{css}</style>;
}
