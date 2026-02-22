import { createContext, useContext, useState, PropsWithChildren } from 'react';
import { shallow } from 'zustand/shallow';
import { useStoreWithEqualityFn } from 'zustand/traditional';

import {
  MembershipProps,
  type MembershipStore,
  MembershipStoreApi,
  membershipStoreCreator,
} from './membership-store-creator';

export const MembershipStoreContext = createContext<
  MembershipStoreApi | undefined
>(undefined);

type MembershipStoreProviderProps = PropsWithChildren<MembershipProps>;

export const MembershipStoreProvider = ({
  children,
  ...props
}: MembershipStoreProviderProps) => {
  const [store] = useState(() => membershipStoreCreator(props));

  return (
    <MembershipStoreContext.Provider value={store}>
      {children}
    </MembershipStoreContext.Provider>
  );
};

export type UseMembershipStoreContextSelector<T> = (
  store: MembershipStore,
) => T;

export const useMembership = <T,>(
  selector: UseMembershipStoreContextSelector<T>,
): T => {
  const membershipStoreContext = useContext(MembershipStoreContext);

  if (membershipStoreContext === undefined) {
    throw new Error(
      'useMembership must be used within MembershipStoreProvider',
    );
  }

  return useStoreWithEqualityFn(membershipStoreContext, selector, shallow);
};
