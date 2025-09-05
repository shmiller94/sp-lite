import React from 'react';

export function useCopyToClipboard<T>(
  value: T,
  options?: {
    resetDelay?: number;
  },
): {
  value: T;
  copied: boolean;
  copyToClipboard: () => void;
  reset: () => void;
} {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(String(value));
      setCopied(true);
      if (options?.resetDelay) {
        setTimeout(() => setCopied(false), options.resetDelay);
      }
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const reset = () => {
    setCopied(false);
  };

  return { value, copied, copyToClipboard, reset };
}
