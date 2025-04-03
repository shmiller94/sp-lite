import React, { SVGProps } from 'react';

export const ArrowLeftIcon: React.FC<SVGProps<SVGSVGElement>> = ({
  ...props
}) => {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 21 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M10.7425 15.8722L4.90918 10.0389M4.90918 10.0389L10.7425 4.20557M4.90918 10.0389H16.5758"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
