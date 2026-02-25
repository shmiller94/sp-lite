import { useEffect } from 'react';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import type { ProtocolAction, ProtocolActionContent } from '../api/protocol';

export type CommittedAction = {
  id: string;
  type: ProtocolActionContent['type'];
  data: ProtocolAction;
  goalId: string;
};

type PersistedState = {
  /** The protocol ID this state belongs to */
  protocolId: string | null;
  /** Timestamp when the protocol was last updated (for staleness detection) */
  protocolUpdatedAt: string | null;
  /** Map of action ID to committed action */
  committedActions: Record<string, CommittedAction>;
};

type RevealBuilderStore = PersistedState & {
  /**
   * Initialize or reset the store for a specific protocol.
   * If the protocol ID or updatedAt has changed, clears existing committed actions.
   * Should be called when entering the reveal flow.
   */
  initializeForProtocol: (
    protocolId: string,
    protocolUpdatedAt: string,
  ) => void;

  /**
   * Check if the store is initialized for the given protocol
   */
  isInitializedForProtocol: (
    protocolId: string,
    protocolUpdatedAt: string,
  ) => boolean;

  /**
   * Commit an action to the protocol
   */
  commitAction: (action: CommittedAction) => void;

  /**
   * Remove a committed action
   */
  uncommitAction: (actionId: string) => void;

  /**
   * Check if an action is committed
   */
  isActionCommitted: (actionId: string) => boolean;

  /**
   * Get all committed actions for a specific goal
   */
  getCommittedActionsForGoal: (goalId: string) => CommittedAction[];

  /**
   * Get all committed actions
   */
  getAllCommittedActions: () => CommittedAction[];

  /**
   * Clear all committed actions (keeps protocol ID for tracking)
   */
  clearCommittedActions: () => void;

  /**
   * Get the count of committed actions
   */
  getCommittedActionCount: () => number;

  /**
   * Fully reset the store (clears everything including protocol ID)
   */
  reset: () => void;
};

const INITIAL_STATE: PersistedState = {
  protocolId: null,
  protocolUpdatedAt: null,
  committedActions: {},
};

export const useRevealBuilderStore = create<RevealBuilderStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...INITIAL_STATE,

        initializeForProtocol: (
          protocolId: string,
          protocolUpdatedAt: string,
        ) => {
          const state = get();

          // If same protocol and same version, keep existing state
          if (
            state.protocolId === protocolId &&
            state.protocolUpdatedAt === protocolUpdatedAt
          ) {
            return;
          }

          // Protocol changed or was updated - reset committed actions
          set((draft) => {
            draft.protocolId = protocolId;
            draft.protocolUpdatedAt = protocolUpdatedAt;
            draft.committedActions = {};
          });
        },

        isInitializedForProtocol: (
          protocolId: string,
          protocolUpdatedAt: string,
        ) => {
          const state = get();
          return (
            state.protocolId === protocolId &&
            state.protocolUpdatedAt === protocolUpdatedAt
          );
        },

        commitAction: (action: CommittedAction) => {
          set((state) => {
            state.committedActions[action.id] = action;
          });
        },

        uncommitAction: (actionId: string) => {
          set((state) => {
            delete state.committedActions[actionId];
          });
        },

        isActionCommitted: (actionId: string) => {
          return actionId in get().committedActions;
        },

        getCommittedActionsForGoal: (goalId: string) => {
          const actions = get().committedActions;
          return Object.values(actions).filter(
            (action) => action.goalId === goalId,
          );
        },

        getAllCommittedActions: () => {
          return Object.values(get().committedActions);
        },

        clearCommittedActions: () => {
          set((state) => {
            state.committedActions = {};
          });
        },

        getCommittedActionCount: () => {
          return Object.keys(get().committedActions).length;
        },

        reset: () => {
          set((state) => {
            state.protocolId = null;
            state.protocolUpdatedAt = null;
            state.committedActions = {};
          });
        },
      })),
      {
        name: 'protocol-reveal-builder',
        version: 1,
        partialize: (state) => ({
          protocolId: state.protocolId,
          protocolUpdatedAt: state.protocolUpdatedAt,
          committedActions: state.committedActions,
        }),
        // Handle migrations when store version changes
        migrate: (persistedState, version) => {
          if (version === 0) {
            // Migration from v0 (no protocol tracking) to v1
            // Clear old data since we can't associate it with a protocol
            return { ...INITIAL_STATE };
          }
          return persistedState as PersistedState;
        },
      },
    ),
    { name: 'reveal-builder-store' },
  ),
);

/**
 * Hook to initialize the reveal builder store for a protocol.
 * Call this at the start of the reveal flow to ensure proper protocol scoping.
 */
export function useInitializeRevealBuilder(
  protocolId: string | undefined,
  protocolUpdatedAt: string | undefined,
) {
  const { initializeForProtocol, isInitializedForProtocol } =
    useRevealBuilderStore();

  const isReady =
    protocolId &&
    protocolUpdatedAt &&
    isInitializedForProtocol(protocolId, protocolUpdatedAt);

  // Initialize if we have protocol info and aren't already initialized
  useEffect(() => {
    if (protocolId && protocolUpdatedAt && !isReady) {
      initializeForProtocol(protocolId, protocolUpdatedAt);
    }
  }, [protocolId, protocolUpdatedAt, isReady, initializeForProtocol]);

  return { isReady: !!isReady };
}
