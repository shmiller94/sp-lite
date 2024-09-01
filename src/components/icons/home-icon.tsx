import React, { SVGProps } from 'react';

export const HomeIcon: React.FC<SVGProps<SVGSVGElement>> = ({ ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="17"
      height="18"
      viewBox="0 0 17 18"
      fill="none"
      {...props}
    >
      <path
        d="M0.425293 7.42021L8.49976 0.75L16.5742 7.42021V17.25H0.425293L0.425293 7.42021Z"
        fill="white"
      />
    </svg>
  );
};
