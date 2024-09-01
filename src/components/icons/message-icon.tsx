import React, { SVGProps } from 'react';

export const MessageIcon: React.FC<SVGProps<SVGSVGElement>> = ({
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      viewBox="0 0 14 15"
      fill="none"
    >
      <path
        opacity="0.8"
        d="M14 10C14 10.442 13.8361 10.8659 13.5444 11.1785C13.2527 11.4911 12.857 11.6667 12.4444 11.6667H3.11111L0 15V1.66667C0 1.22464 0.163888 0.800716 0.455612 0.488155C0.747335 0.175595 1.143 0 1.55556 0H12.4444C12.857 0 13.2527 0.175595 13.5444 0.488155C13.8361 0.800716 14 1.22464 14 1.66667V10Z"
        fill="white"
      />
    </svg>
  );
};
