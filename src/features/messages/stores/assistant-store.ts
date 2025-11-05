import type { SetStateAction } from 'react';
import { create } from 'zustand';

interface AssistantState {
  isExpanded: boolean;
  input: string;
  open: (input?: string) => void;
  close: () => void;
  toggle: (input?: string) => void;
  setInput: (value: SetStateAction<string>) => void;
  clearInput: () => void;
}

export const useAssistantStore = create<AssistantState>()((set) => ({
  isExpanded: false,
  input: '',
  open: (input) =>
    set((s) => ({
      isExpanded: true,
      input: typeof input === 'string' ? input : s.input,
    })),
  close: () => set(() => ({ isExpanded: false })),
  toggle: (input) =>
    set((s) => ({
      isExpanded: !s.isExpanded,
      input: typeof input === 'string' ? input : s.input,
    })),
  setInput: (value) =>
    set((s) => ({
      input: typeof value === 'function' ? value(s.input) : value,
    })),
  clearInput: () => set(() => ({ input: '' })),
}));
