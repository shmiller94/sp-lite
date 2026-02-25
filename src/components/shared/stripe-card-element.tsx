import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
} from '@stripe/react-stripe-js';
import { StripeElementStyle, StripeError } from '@stripe/stripe-js';
import { AlertCircle } from 'lucide-react';
import { useState } from 'react';

import { Label } from '@/components/ui/label';
import { Body2 } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

const STRIPE_INPUT_STYLE: { style: StripeElementStyle } = {
  style: {
    base: {
      color: '#52525B',
      fontSize: '16px',
      '::placeholder': {
        color: '#A1A1AA',
      },
      '::selection': { color: 'white', backgroundColor: '#FDBA74' },
    },
    invalid: {
      color: '#B90090',
    },
  },
};

// Common input styling for all Stripe elements
const commonInputClasses =
  'rounded-xl shadow-sm border border-input transition-all duration-150 overflow-auto bg-white px-6 py-4 text-base text-foreground placeholder:text-muted-foreground [&_input]:caret-vermillion-900';

enum ERROR_TYPES {
  CVC = 'incomplete_cvc',
  EXPIRY = 'incomplete_expiry',
  NUMBER = 'incomplete_number',
}

interface StripeCardFormProps {
  error?: StripeError;
  setError?: (error: StripeError | undefined) => void;
  processing: boolean;
}

export const StripeCardElement = ({
  processing,
  error,
  setError,
}: StripeCardFormProps) => {
  const [focusedElement, setFocusedElement] = useState<string | null>(null);

  return (
    <div className="grid gap-4">
      <div className="space-y-2">
        <Label htmlFor="cardNumber" className={cn('text-sm text-zinc-500')}>
          Card number
        </Label>
        <CardNumberElement
          id="cardNumber"
          options={{
            disableLink: true,
            disabled: processing,
            ...STRIPE_INPUT_STYLE,
          }}
          onFocus={() => {
            if (setError) {
              setError(undefined);
            }
            setFocusedElement('cardNumber');
          }}
          onBlur={() => setFocusedElement(null)}
          className={cn(
            commonInputClasses,
            focusedElement === 'cardNumber'
              ? 'bg-zinc-50 ring-2 ring-ring'
              : '',
            processing ? 'opacity-50' : null,
            error?.code === ERROR_TYPES.NUMBER
              ? 'border-pink-700 bg-pink-50 placeholder:text-pink-700'
              : null,
          )}
        />
        {error?.code === ERROR_TYPES.NUMBER ? (
          <Body2 className="text-pink-700">
            <span className="flex items-center gap-4">
              <AlertCircle className="size-4 shrink-0 text-destructive" />
              <span>{error?.message}</span>
            </span>
          </Body2>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label
            htmlFor="cardExpiration"
            className={cn('text-sm text-zinc-500')}
          >
            Expiration date
          </Label>
          <CardExpiryElement
            options={{
              disabled: processing,
              ...STRIPE_INPUT_STYLE,
            }}
            onFocus={() => {
              if (setError) {
                setError(undefined);
              }
              setFocusedElement('cardExpiration');
            }}
            onBlur={() => setFocusedElement(null)}
            id="cardExpiration"
            className={cn(
              commonInputClasses,
              focusedElement === 'cardExpiration'
                ? 'bg-zinc-50 ring-2 ring-ring'
                : '',
              processing ? 'opacity-50' : null,
              error?.code === ERROR_TYPES.EXPIRY
                ? 'border-pink-700 bg-pink-50 text-pink-700 placeholder:text-pink-700'
                : null,
            )}
          />
          {error?.code === ERROR_TYPES.EXPIRY ? (
            <Body2 className="text-pink-700">
              <span className="flex items-center gap-4">
                <AlertCircle className="size-4 shrink-0 text-destructive" />
                <span>{error?.message}</span>
              </span>
            </Body2>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cardCvc" className={cn('text-sm text-zinc-500')}>
            CVC
          </Label>
          <CardCvcElement
            options={{
              disabled: processing,
              ...STRIPE_INPUT_STYLE,
            }}
            onFocus={() => {
              if (setError) {
                setError(undefined);
              }
              setFocusedElement('cardCvc');
            }}
            onBlur={() => setFocusedElement(null)}
            id="cardCvc"
            className={cn(
              commonInputClasses,
              focusedElement === 'cardCvc' ? 'bg-zinc-50 ring-2 ring-ring' : '',
              processing ? 'opacity-50' : null,
              error?.code === ERROR_TYPES.CVC
                ? 'border-pink-700 bg-pink-50 text-pink-700 placeholder:text-pink-700'
                : null,
            )}
          />
          {error?.code === ERROR_TYPES.CVC ? (
            <Body2 className="text-pink-700">
              <span className="flex items-center gap-4">
                <AlertCircle className="size-4 shrink-0 text-destructive" />
                <span>{error?.message}</span>
              </span>
            </Body2>
          ) : null}
        </div>
      </div>
    </div>
  );
};
