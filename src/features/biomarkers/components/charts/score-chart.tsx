import { Label, Pie, PieChart } from 'recharts';

import { ChartConfig, ChartContainer } from '@/components/ui/chart';
import { STATUS_TO_COLOR } from '@/features/biomarkers/const/status-to-color';
import { getStatusForScore } from '@/features/biomarkers/utils/get-status-for-score';
import { cn } from '@/lib/utils';

type ScoreChartProps = {
  gaugePrimaryColor?: string;
  gaugeSecondaryColor?: string;
  labelColor?: string;
  className?: string;
  richColors?: boolean;
  value: number;
};

export const ScoreChart = ({
  gaugePrimaryColor = 'white',
  gaugeSecondaryColor = 'white',
  labelColor = 'white',
  richColors = false,
  className,
  value,
}: ScoreChartProps) => {
  const status = getStatusForScore(value);

  const chartConfig = {
    score: {
      label: 'Score',
    },
  } satisfies ChartConfig;

  const data = [
    {
      score: value,
      fill: richColors
        ? STATUS_TO_COLOR[status.toLocaleLowerCase()]
        : gaugePrimaryColor,
    },
    {
      score: 100 - value,
      fill: richColors
        ? STATUS_TO_COLOR[status.toLocaleLowerCase()]
        : gaugeSecondaryColor,
      opacity: 0.3,
    },
  ];

  return (
    <ChartContainer
      config={chartConfig}
      className={cn('w-full max-w-[250px] max-h-[250px]', className)}
    >
      {/* This is hack: https://github.com/recharts/recharts/discussions/3846#discussioncomment-7278088 */}
      <PieChart margin={{ bottom: -60 }}>
        <Pie
          startAngle={180}
          endAngle={0}
          innerRadius="75%"
          data={data}
          dataKey="score"
          blendStroke
          cornerRadius={10}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) - 8}
                      className="text-6xl"
                      style={{ fill: labelColor }}
                    >
                      {value}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 16}
                      className="text-sm"
                      style={{ fill: labelColor }}
                    >
                      out of 100
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
};
