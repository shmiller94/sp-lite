// New AI-generated protocol API (ts-ai-chat)
export {
  useLatestProtocol,
  useProtocol,
  useProtocols,
  useUpdateActionAcceptance,
} from './protocol';
export type {
  Protocol,
  ProtocolGoal,
  ProtocolAction,
  ProtocolActionContent,
  ProtocolCitation,
} from './protocol';

// Legacy protocol API (ts-server) - uses FHIR CarePlan model
export {
  useLegacyProtocols,
  useLegacyLatestProtocol,
  useLegacyProtocol,
} from './legacy/legacy-protocol';
export type {
  LegacyProtocol,
  LegacyGoal,
  LegacyActivity,
  LegacyCitation,
} from './legacy/legacy-protocol';

// Reveal API
export { useRevealLatest } from './reveal';

// Backward-compatible type aliases for components using generic names
// These map to Legacy types for existing components
export type { LegacyActivity as Activity } from './legacy/legacy-protocol';
export type { LegacyGoal as Goal } from './legacy/legacy-protocol';
export type { LegacyCitation as Citation } from './legacy/legacy-protocol';
