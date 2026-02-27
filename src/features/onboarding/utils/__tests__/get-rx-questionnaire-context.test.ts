import { describe, expect, it } from 'vitest';

import {
  NON_SYMPTOM_RX_VALUE_RE,
  RX_ASSESSMENTS,
  RX_SYMPTOM_TRACKERS,
} from '@/const/questionnaire';

describe('NON_SYMPTOM_RX_VALUE_RE', () => {
  it('matches all non-symptom-tracker rx-assessment questionnaire names', () => {
    const symptomTrackerNameSet = new Set<string>(RX_SYMPTOM_TRACKERS);

    for (const name of RX_ASSESSMENTS) {
      const isSymptomTracker = symptomTrackerNameSet.has(name);
      const matches = NON_SYMPTOM_RX_VALUE_RE.test(name);
      expect(matches).toBe(!isSymptomTracker);
    }
  });

  it('matches future rx intake names and excludes symptom trackers by suffix', () => {
    expect(NON_SYMPTOM_RX_VALUE_RE.test('rx-assessment-metabolic')).toBe(true);
    expect(
      NON_SYMPTOM_RX_VALUE_RE.test('rx-assessment-metabolic-symptom-tracker'),
    ).toBe(false);
  });
});
