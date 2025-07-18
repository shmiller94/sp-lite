import { motion } from 'framer-motion';
import { Pie, PieChart } from 'recharts';

import NumberFlow from '@/components/shared/number-flow';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';
import { STATUS_TO_COLOR } from '@/const/status-to-color';
import { getStatusForScore } from '@/features/biomarkers/utils/get-status-for-score';
import { cn } from '@/lib/utils';

type ScoreChartProps = {
  gaugePrimaryColor?: string;
  gaugeSecondaryColor?: string;
  labelColor?: string;
  className?: string;
  richColors?: boolean;
  value: number;
  animate?: boolean;
};

export const ScoreChart = ({
  gaugePrimaryColor = 'white',
  gaugeSecondaryColor = 'white',
  labelColor = 'white',
  richColors = false,
  className,
  value,
  animate = false,
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
        ? STATUS_TO_COLOR[
            status.toLocaleLowerCase() as keyof typeof STATUS_TO_COLOR
          ]
        : gaugePrimaryColor,
    },
    {
      score: 100 - value,
      fill: richColors
        ? STATUS_TO_COLOR[
            status.toLocaleLowerCase() as keyof typeof STATUS_TO_COLOR
          ]
        : gaugeSecondaryColor,
      opacity: 0.3,
    },
  ];

  const textVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
        delay: 0.3,
      },
    },
  };

  const chartVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <div
      className={cn(
        'relative w-full max-w-[250px] max-h-[250px] mb-7',
        className,
      )}
    >
      <motion.div
        initial={animate ? 'hidden' : 'visible'}
        animate="visible"
        variants={chartVariants}
        className="size-full"
      >
        <ChartContainer config={chartConfig} className="size-full">
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
            />
          </PieChart>
        </ChartContainer>
      </motion.div>

      {/* Separate text overlay that can be animated independently */}
      <motion.div
        className="absolute inset-0 top-10 flex flex-col items-center justify-center"
        initial={animate ? 'hidden' : 'visible'}
        animate="visible"
        variants={textVariants}
      >
        <span className="text-6xl leading-none" style={{ color: labelColor }}>
          <NumberFlow value={value} />
        </span>
        <span className="-mt-4 text-sm" style={{ color: labelColor }}>
          out of 100
        </span>
      </motion.div>
    </div>
  );
};
