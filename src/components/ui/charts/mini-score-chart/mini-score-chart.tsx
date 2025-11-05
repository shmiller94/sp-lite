import { CategoryValue } from '@/types/api';

import { getBiomarkerColor } from '../utils/get-biomarker-color';

import { CHART_CONFIG } from './config';

export const MiniScoreChart = ({ value }: { value: CategoryValue }) => {
  const getPercentage = (val: CategoryValue): number => {
    return CHART_CONFIG.CATEGORY_VALUES[val] || 0;
  };

  const size = CHART_CONFIG.SIZE;
  const strokeWidth = CHART_CONFIG.STROKE_WIDTH;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = getPercentage(value);
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-block">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={getBiomarkerColor(value).default}
          strokeOpacity={0.2}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={getBiomarkerColor(value).default}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
          style={{
            strokeDashoffset: circumference,
            animation: `draw-circle-${value} ${CHART_CONFIG.ANIMATION_DURATION}ms ${CHART_CONFIG.ANIMATION_EASE} ${CHART_CONFIG.ANIMATION_DELAY}ms forwards`,
          }}
        />
        <text
          x={size / 2}
          y={size / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={getBiomarkerColor(value).default}
          transform="rotate(90 11.5 11.5)"
          className="font-sans text-sm font-medium"
        >
          {value}
        </text>
      </svg>
      {/* Animation for the circle - only used here, no need for global tailwind class */}
      <style>{`
        @keyframes draw-circle-${value} {
          to {
            stroke-dashoffset: ${strokeDashoffset};
          }
        }
      `}</style>
    </div>
  );
};
