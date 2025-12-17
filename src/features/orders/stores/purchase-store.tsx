import { createContext, useContext, useRef, PropsWithChildren } from 'react';
import { shallow } from 'zustand/shallow';
import { useStoreWithEqualityFn } from 'zustand/traditional';

import {
  PurchaseStore,
  PurchaseStoreApi,
  purchaseStoreCreator,
  PurchaseStoreProps,
} from './purchase-store-creator';

export const PurchaseStoreContext = createContext<PurchaseStoreApi | undefined>(
  undefined,
);

type PurchaseStoreProviderProps = PropsWithChildren<PurchaseStoreProps>;

export const PurchaseStoreProvider = ({
  children,
  ...props
}: PurchaseStoreProviderProps) => {
  const orderStoreRef = useRef<PurchaseStoreApi>();
  if (!orderStoreRef.current) {
    orderStoreRef.current = purchaseStoreCreator(props);
  }

  return (
    <PurchaseStoreContext.Provider value={orderStoreRef.current}>
      {children}
    </PurchaseStoreContext.Provider>
  );
};

export type UsePurchaseStoreContextSelector<T> = (store: PurchaseStore) => T;

export const usePurchaseStore = <T,>(
  selector: UsePurchaseStoreContextSelector<T>,
): T => {
  const purchaseStoreContext = useContext(PurchaseStoreContext);

  if (purchaseStoreContext === undefined) {
    throw new Error(
      'usePurchaseStore must be used within PurchaseStoreProvider',
    );
  }

  return useStoreWithEqualityFn(purchaseStoreContext, selector, shallow);
};
