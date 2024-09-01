import React, { SVGProps } from 'react';

export const DataIcon: React.FC<SVGProps<SVGSVGElement>> = ({ ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      viewBox="0 0 15 15"
      fill="none"
    >
      <g opacity="0.8">
        <rect
          x="0.5"
          y="5.11523"
          width="4"
          height="10.3846"
          rx="1"
          fill="white"
        />
        <rect x="5.5" y="0.5" width="4" height="15" rx="1" fill="white" />
        <rect
          x="10.5"
          y="5.11523"
          width="4"
          height="10.3846"
          rx="1"
          fill="white"
        />
      </g>
    </svg>
  );
};
