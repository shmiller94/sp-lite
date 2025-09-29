import React, { SVGProps } from 'react';

export const PerplexityIcon: React.FC<SVGProps<SVGSVGElement>> = ({
  ...props
}) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="16" height="16" fill="white" />
      <g clipPath="url(#clip0_6499_34138)">
        <path
          d="M2.87012 0L7.41718 4.18944V4.18848V0.00966696H8.30232V4.20818L12.8697 0V4.77658H14.745V11.6663H12.8755V15.9197L8.30232 11.9018V15.9658H7.41718V11.968L2.87528 15.9684V11.6663H1V4.77658H2.87012V0ZM6.74989 5.6509H1.88513V10.792H2.87417V9.17032L6.74989 5.6509ZM3.76036 9.55826V14.0174L7.41718 10.7966V6.23683L3.76036 9.55826ZM8.32779 10.754V6.23253L11.9857 9.55417V11.6663H11.9904V13.9719L8.32779 10.754ZM12.8755 10.792H13.8598V5.6509H9.03131L12.8755 9.13388V10.792ZM11.9846 4.77658V2.01113L8.98305 4.77658H11.9846ZM6.75677 4.77658H3.75526V2.01113L6.75677 4.77658Z"
          fill="#3F7E8B"
        />
      </g>
      <defs>
        <clipPath id="clip0_6499_34138">
          <rect
            width="13.745"
            height="16"
            fill="white"
            transform="translate(1)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};
