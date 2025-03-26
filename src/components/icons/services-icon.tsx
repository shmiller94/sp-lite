import React, { SVGProps } from 'react';

export const ServicesIcon: React.FC<SVGProps<SVGSVGElement>> = ({
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="19"
      height="19"
      viewBox="0 0 19 19"
      fill="none"
      {...props}
    >
      <rect
        x="0.0703125"
        y="10.7041"
        width="8.2949"
        height="8.2958"
        rx="1.39992"
        fill="currentColor"
      />
      <rect
        x="0.0703125"
        y="0.334473"
        width="8.2949"
        height="8.2958"
        rx="1.39992"
        fill="currentColor"
      />
      <rect
        x="10.4453"
        y="10.7041"
        width="8.2949"
        height="8.2958"
        rx="1.39992"
        fill="currentColor"
      />
      <rect
        x="10.4453"
        y="0.334473"
        width="8.2949"
        height="8.2958"
        rx="1.39992"
        fill="currentColor"
      />
    </svg>
  );
};
