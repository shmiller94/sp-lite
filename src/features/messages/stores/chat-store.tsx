import { create } from 'zustand';

type ChatType = 'ai' | 'concierge';

interface ChatState {
  type: ChatType;
  sessionStartTime: number | null;
  messageCount: number;
  responseTimes: number[];
  update: (type: ChatType) => void;
  setSessionStartTime: (time: number) => void;
  incrementMessageCount: () => void;
  addResponseTime: (time: number) => void;
  resetSession: () => void;
}

export const useChatStore = create<ChatState>()((set) => ({
  type: 'ai',
  sessionStartTime: null,
  messageCount: 0,
  responseTimes: [],
  update: (type) => set(() => ({ type })),
  setSessionStartTime: (time) => set(() => ({ sessionStartTime: time })),
  incrementMessageCount: () =>
    set((state) => ({ messageCount: state.messageCount + 1 })),
  addResponseTime: (time) =>
    set((state) => ({ responseTimes: [...state.responseTimes, time] })),
  resetSession: () =>
    set(() => ({ sessionStartTime: null, messageCount: 0, responseTimes: [] })),
}));
