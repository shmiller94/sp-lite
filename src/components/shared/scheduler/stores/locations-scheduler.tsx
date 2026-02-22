import {
  createContext,
  useContext,
  useEffect,
  useState,
  PropsWithChildren,
} from 'react';
import { shallow } from 'zustand/shallow';
import { useStoreWithEqualityFn } from 'zustand/traditional';

import {
  LocationsSchedulerProps,
  LocationsSchedulerStore,
  LocationsSchedulerStoreApi,
  locationsSchedulerStoreCreator,
} from './locations-scheduler-store-creator';

export const LocationsSchedulerStoreContext = createContext<
  LocationsSchedulerStoreApi | undefined
>(undefined);

type LocationsSchedulerStoreProviderProps =
  PropsWithChildren<LocationsSchedulerProps>;

export const LocationsSchedulerStoreProvider = ({
  children,
  ...props
}: LocationsSchedulerStoreProviderProps) => {
  const [store] = useState(() => locationsSchedulerStoreCreator(props));

  // Keep onSelectionChange callback in sync - it captures parent state in closure
  useEffect(() => {
    store.setState({
      onSelectionChange: props.onSelectionChange,
    });
  }, [props.onSelectionChange, store]);

  return (
    <LocationsSchedulerStoreContext.Provider value={store}>
      {children}
    </LocationsSchedulerStoreContext.Provider>
  );
};

export type UseLocationsSchedulerStoreContextSelector<T> = (
  store: LocationsSchedulerStore,
) => T;

export const useLocationsScheduler = <T,>(
  selector: UseLocationsSchedulerStoreContextSelector<T>,
): T => {
  const context = useContext(LocationsSchedulerStoreContext);

  if (context === undefined) {
    throw new Error(
      'useLocationsScheduler must be used within LocationsSchedulerStoreProvider',
    );
  }

  return useStoreWithEqualityFn(context, selector, shallow);
};
