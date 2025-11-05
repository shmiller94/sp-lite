import React, { SVGProps } from 'react';

export const ImageFileIcon: React.FC<SVGProps<SVGSVGElement>> = ({
  ...props
}) => {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_1246_26733)">
        <path
          d="M5.5 13L7 11L8.99851 8.33532C9.57845 7.56206 10.6284 7.3142 11.4929 7.74647L12.5 8.25"
          stroke="#FC5F2B"
          strokeWidth="1.33"
          strokeLinecap="square"
        />
        <circle cx="5" cy="5" r="1.335" stroke="#FC5F2B" strokeWidth="1.33" />
      </g>
      <rect
        x="0.665"
        y="0.665"
        width="12.67"
        height="12.67"
        rx="2.335"
        stroke="#FC5F2B"
        strokeWidth="1.33"
      />
      <defs>
        <clipPath id="clip0_1246_26733">
          <rect width="14" height="14" rx="3" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
