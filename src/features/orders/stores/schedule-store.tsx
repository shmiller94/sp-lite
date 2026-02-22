import { createContext, useContext, useState, PropsWithChildren } from 'react';
import { shallow } from 'zustand/shallow';
import { useStoreWithEqualityFn } from 'zustand/traditional';

import {
  ScheduleStore,
  ScheduleStoreApi,
  ScheduleStoreProps,
  scheduleStoreCreator,
} from '@/features/orders/stores/schedule-store-creator';

export const ScheduleStoreContext = createContext<ScheduleStoreApi | undefined>(
  undefined,
);

type ScheduleStoreProviderProps = PropsWithChildren<ScheduleStoreProps>;

export const ScheduleStoreProvider = ({
  children,
  ...props
}: ScheduleStoreProviderProps) => {
  const [store] = useState(() => scheduleStoreCreator(props));

  return (
    <ScheduleStoreContext.Provider value={store}>
      {children}
    </ScheduleStoreContext.Provider>
  );
};

export type UseScheduleStoreContextSelector<T> = (store: ScheduleStore) => T;

export const useScheduleStore = <T,>(
  selector: UseScheduleStoreContextSelector<T>,
): T => {
  const scheduleStoreContext = useContext(ScheduleStoreContext);

  if (scheduleStoreContext === undefined) {
    throw new Error(
      'useScheduleStore must be used within ScheduleStoreProvider',
    );
  }

  return useStoreWithEqualityFn(scheduleStoreContext, selector, shallow);
};
