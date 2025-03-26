import React, { SVGProps } from 'react';

export const DataIcon: React.FC<SVGProps<SVGSVGElement>> = ({ ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="21"
      viewBox="0 0 22 21"
      fill="none"
      {...props}
    >
      <rect
        x="2.21289"
        y="6.96643"
        width="5.25049"
        height="12.7212"
        rx="1.37812"
        fill="currentColor"
      />
      <rect
        x="8.7793"
        y="1.31268"
        width="5.25049"
        height="18.375"
        rx="1.37812"
        fill="currentColor"
      />
      <rect
        x="15.3379"
        y="6.96637"
        width="5.25049"
        height="12.7212"
        rx="1.37812"
        fill="currentColor"
      />
    </svg>
  );
};
