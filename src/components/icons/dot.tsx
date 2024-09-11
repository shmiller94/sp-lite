import React, { SVGProps } from 'react';

export const DotIcon: React.FC<SVGProps<SVGSVGElement>> = ({
  fill = '#A1A1AA',
  width = 3,
  height = 4,
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      {...props}
    >
      <circle cx="1.5" cy="2" r="1.5" fill={fill} />
    </svg>
  );
};
