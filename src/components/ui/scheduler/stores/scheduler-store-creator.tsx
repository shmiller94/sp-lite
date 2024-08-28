import moment, { Moment } from 'moment';
import { createStore } from 'zustand';

import { Slot } from '@/types/api';

export interface SchedulerProps {
  slots: Slot[];
  tz: string;
  updateStart: (date: Date) => void;
  slotsLoading: boolean;
  onSlotUpdate?: (slot: Slot | null) => void;
  numDays: number;
  showCreateBtn?: boolean;
}

export interface SchedulerStore extends SchedulerProps {
  selectedDay: Moment | undefined;
  updateSelectedDay: (day: Moment | undefined) => void;
  slot: Slot | undefined;
  updateSlot: (slot: Slot | undefined) => void | undefined;
  startRange: Moment;
  updateStartRange: (date: Moment) => void;
}

export type SchedulerStoreApi = ReturnType<typeof schedulerStoreCreator>;

export const schedulerStoreCreator = (initProps: SchedulerProps) => {
  const DEFAULT_PROPS: SchedulerProps = {
    slots: initProps.slots,
    tz: initProps.tz,
    slotsLoading: initProps.slotsLoading,
    numDays: initProps.numDays,
    updateStart: initProps.updateStart,
    onSlotUpdate: initProps.onSlotUpdate,
    showCreateBtn: initProps.showCreateBtn,
  };

  return createStore<SchedulerStore>()((set) => ({
    ...DEFAULT_PROPS,
    selectedDay: undefined,
    updateSelectedDay: (day) =>
      set((state) => ({ ...state, selectedDay: day })),
    slot: undefined,
    updateSlot: (slot) => set((state) => ({ ...state, slot: slot })),
    startRange: moment().tz(DEFAULT_PROPS.tz as string),
    updateStartRange: (date) =>
      set((state) => ({ ...state, startRange: date })),
  }));
};
