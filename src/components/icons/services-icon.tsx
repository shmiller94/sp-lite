import React, { SVGProps } from 'react';

export const ServicesIcon: React.FC<SVGProps<SVGSVGElement>> = ({
  ...props
}) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect x="3" y="13" width="8" height="8" rx="1" fill="white" />
      <rect x="3" y="3" width="8" height="8" rx="1" fill="white" />
      <rect x="13" y="13" width="8" height="8" rx="1" fill="white" />
      <rect x="13" y="3" width="8" height="8" rx="1" fill="white" />
    </svg>
  );
};
