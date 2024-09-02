import React, { SVGProps } from 'react';

export const HomeIcon: React.FC<SVGProps<SVGSVGElement>> = ({ ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="21"
      viewBox="0 0 22 21"
      fill="none"
      {...props}
    >
      <path
        d="M2.65039 9.66C2.65039 9.13155 2.88919 8.6314 3.30013 8.29915L10.3001 2.63957C10.9419 2.12071 11.8589 2.12071 12.5007 2.63957L19.5007 8.29915C19.9116 8.6314 20.1504 9.13155 20.1504 9.66V17.5C20.1504 18.4665 19.3669 19.25 18.4004 19.25H4.40039C3.43389 19.25 2.65039 18.4665 2.65039 17.5L2.65039 9.66Z"
        fill="#A1A1AA"
      />
    </svg>
  );
};
