import { createContext, useContext, useRef, PropsWithChildren } from 'react';
import { shallow } from 'zustand/shallow';
import { useStoreWithEqualityFn } from 'zustand/traditional';

import {
  CheckoutStoreApi,
  CheckoutStore,
  checkoutStoreCreator,
} from '@/features/action-plan/stores/checkout-store-creator';

export const CheckoutStoreContext = createContext<CheckoutStoreApi | undefined>(
  undefined,
);

type CheckoutStoreProviderProps = PropsWithChildren;

export const CheckoutStoreProvider = ({
  children,
}: CheckoutStoreProviderProps) => {
  const checkoutStoreRef = useRef<CheckoutStoreApi>();
  if (!checkoutStoreRef.current) {
    checkoutStoreRef.current = checkoutStoreCreator();
  }

  return (
    <CheckoutStoreContext.Provider value={checkoutStoreRef.current}>
      {children}
    </CheckoutStoreContext.Provider>
  );
};

export type UseCheckoutStoreContextSelector<T> = (store: CheckoutStore) => T;

export const useCheckout = <T,>(
  selector: UseCheckoutStoreContextSelector<T>,
): T => {
  const checkoutStoreContext = useContext(CheckoutStoreContext);

  if (checkoutStoreContext === undefined) {
    throw new Error('useCheckout must be used within CheckoutStoreProvider');
  }

  return useStoreWithEqualityFn(checkoutStoreContext, selector, shallow);
};
