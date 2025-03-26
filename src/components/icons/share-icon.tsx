import { SVGProps } from 'react';

export const ShareIcon: React.FC<SVGProps<SVGSVGElement>> = ({ ...props }) => {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 19 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M16.25 11.4434V14.4434C16.25 14.8412 16.092 15.2227 15.8107 15.504C15.5294 15.7853 15.1478 15.9434 14.75 15.9434H4.25C3.85218 15.9434 3.47064 15.7853 3.18934 15.504C2.90804 15.2227 2.75 14.8412 2.75 14.4434V11.4434M13.25 6.19336L9.5 2.44336M9.5 2.44336L5.75 6.19336M9.5 2.44336V11.4434"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
