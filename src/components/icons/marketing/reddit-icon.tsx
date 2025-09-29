import React, { SVGProps } from 'react';

export const RedditIcon: React.FC<SVGProps<SVGSVGElement>> = ({ ...props }) => {
  return (
    <svg viewBox="0 0 216 216" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fill="#ff4500"
        d="M108 0C48.35 0 0 48.35 0 108c0 29.82 12.09 56.82 31.63 76.37l-20.57 20.57C6.98 209.02 9.87 216 15.64 216H108c59.65 0 108-48.35 108-108S167.65 0 108 0Z"
      />
      <circle cx="169.22" cy="106.98" r="25.22" fill="url(#reddit__a)" />
      <circle cx="46.78" cy="106.98" r="25.22" fill="url(#reddit__c)" />
      <ellipse cx="108.06" cy="128.64" rx="72" ry="54" fill="url(#reddit__d)" />
      <path
        fill="url(#reddit__b)"
        d="M86.78 123.48c-.42 9.08-6.49 12.38-13.56 12.38s-12.46-4.93-12.04-14.01c.42-9.08 6.49-15.02 13.56-15.02s12.46 7.58 12.04 16.66Z"
      />
      <path
        fill="url(#reddit__e)"
        d="M129.35 123.48c.42 9.08 6.49 12.38 13.56 12.38s12.46-4.93 12.04-14.01c-.42-9.08-6.49-15.02-13.56-15.02s-12.46 7.58-12.04 16.66Z"
      />
      <ellipse cx="79.63" cy="116.37" rx="2.8" ry="3.05" />
      <ellipse cx="146.21" cy="116.37" rx="2.8" ry="3.05" />
      <path
        fill="url(#reddit__f)"
        d="M108.06 142.92c-8.76 0-17.16.43-24.92 1.22-1.33.13-2.17 1.51-1.65 2.74 4.35 10.39 14.61 17.69 26.57 17.69s22.23-7.3 26.57-17.69c.52-1.23-.33-2.61-1.65-2.74-7.77-.79-16.16-1.22-24.92-1.22Z"
      />
      <circle cx="147.49" cy="49.43" r="17.87" fill="url(#reddit__g)" />
      <path
        fill="url(#reddit__h)"
        d="M107.8 76.92c-2.14 0-3.87-.89-3.87-2.27 0-16.01 13.03-29.04 29.04-29.04 2.14 0 3.87 1.73 3.87 3.87s-1.73 3.87-3.87 3.87c-11.74 0-21.29 9.55-21.29 21.29 0 1.38-1.73 2.27-3.87 2.27Z"
      />
      <path
        fill="#842123"
        d="M62.82 122.65c.39-8.56 6.08-14.16 12.69-14.16 6.26 0 11.1 6.39 11.28 14.33.17-8.88-5.13-15.99-12.05-15.99s-13.14 6.05-13.56 15.2c-.42 9.15 4.97 13.83 12.04 13.83h.52c-6.44-.16-11.3-4.79-10.91-13.2Zm90.48 0c-.39-8.56-6.08-14.16-12.69-14.16-6.26 0-11.1 6.39-11.28 14.33-.17-8.88 5.13-15.99 12.05-15.99 7.07 0 13.14 6.05 13.56 15.2.42 9.15-4.97 13.83-12.04 13.83h-.52c6.44-.16 11.3-4.79 10.91-13.2Z"
      />

      <defs>
        {/* simple, non-intrusive gradients so the fills render */}
        <radialGradient id="reddit__a" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#fff3f0" />
        </radialGradient>
        <radialGradient id="reddit__c" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#fff3f0" />
        </radialGradient>
        <radialGradient id="reddit__d" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f5f5f5" />
        </radialGradient>
        <linearGradient id="reddit__b" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ff6a4d" />
          <stop offset="100%" stopColor="#ff4500" />
        </linearGradient>
        <linearGradient id="reddit__e" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ff6a4d" />
          <stop offset="100%" stopColor="#ff4500" />
        </linearGradient>
        <linearGradient id="reddit__f" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#e6e6e6" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
        <radialGradient id="reddit__g" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff7a33" />
          <stop offset="100%" stopColor="#ff4500" />
        </radialGradient>
        <linearGradient id="reddit__h" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#cfcfcf" />
          <stop offset="100%" stopColor="#eeeeee" />
        </linearGradient>
      </defs>
    </svg>
  );
};
