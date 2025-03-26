import { SVGProps } from 'react';

export const PlusCircleIcon: React.FC<SVGProps<SVGSVGElement>> = ({
  ...props
}) => {
  return (
    <svg
      width="43"
      height="43"
      viewBox="0 0 43 43"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M0.5 21.1934C0.5 9.59538 9.90202 0.193359 21.5 0.193359C33.098 0.193359 42.5 9.59538 42.5 21.1934C42.5 32.7913 33.098 42.1934 21.5 42.1934C9.90202 42.1934 0.5 32.7913 0.5 21.1934Z"
        fill="currentColor"
      />
      <path
        d="M16.25 21.1934H26.75M21.5 15.9434V26.4434"
        stroke="#FAFAFA"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
