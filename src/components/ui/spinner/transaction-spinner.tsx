import { Spinner, SpinnerProps } from './spinner';

export type TransactionSpinnerProps = SpinnerProps & {
  className?: string;
};

export const TransactionSpinner = ({
  size = 'sm',
  variant = 'light',
  className = '',
}: TransactionSpinnerProps) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Spinner size={size} variant={variant} />
      <div className="flex items-center text-sm">
        <span>Just a moment</span>
        <span className="inline-flex w-5 justify-center">
          <span className="animate-dot1">.</span>
          <span className="animate-dot2">.</span>
          <span className="animate-dot3">.</span>
        </span>
      </div>
      <span className="sr-only">Processing transaction</span>
    </div>
  );
};
