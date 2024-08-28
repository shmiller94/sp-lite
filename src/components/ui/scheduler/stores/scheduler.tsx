import { createContext, useContext, useRef, PropsWithChildren } from 'react';
import { shallow } from 'zustand/shallow';
import { useStoreWithEqualityFn } from 'zustand/traditional';

import {
  SchedulerProps,
  SchedulerStore,
  SchedulerStoreApi,
  schedulerStoreCreator,
} from '@/components/ui/scheduler/stores/scheduler-store-creator';

export const SchedulerStoreContext = createContext<
  SchedulerStoreApi | undefined
>(undefined);

type SchedulerStoreProviderProps = PropsWithChildren<SchedulerProps>;

export const SchedulerStoreProvider = ({
  children,
  ...props
}: SchedulerStoreProviderProps) => {
  const schedulerStoreRef = useRef<SchedulerStoreApi>();
  if (!schedulerStoreRef.current) {
    schedulerStoreRef.current = schedulerStoreCreator(props);
  }

  return (
    <SchedulerStoreContext.Provider value={schedulerStoreRef.current}>
      {children}
    </SchedulerStoreContext.Provider>
  );
};

export type UseSchedulerStoreContextSelector<T> = (store: SchedulerStore) => T;

export const useScheduler = <T,>(
  selector: UseSchedulerStoreContextSelector<T>,
): T => {
  const schedulerStoreContext = useContext(SchedulerStoreContext);

  if (schedulerStoreContext === undefined) {
    throw new Error('useScheduler must be used within CounterStoreProvider');
  }

  return useStoreWithEqualityFn(schedulerStoreContext, selector, shallow);
};
