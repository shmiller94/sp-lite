import { defineStepper } from '@stepperize/react';

export const TEST_KIT_STEPS = {
  COVER: 'cover',
  SELECT_GUT: 'select-gut',
  SELECT_TOXINS: 'select-toxins',
  CHECKOUT: 'checkout',
  BOOKING: 'booking',
} as const satisfies Record<string, string>;

export const TestKitStepper = defineStepper(
  { id: TEST_KIT_STEPS.COVER },
  { id: TEST_KIT_STEPS.SELECT_GUT },
  { id: TEST_KIT_STEPS.SELECT_TOXINS },
  { id: TEST_KIT_STEPS.CHECKOUT },
  { id: TEST_KIT_STEPS.BOOKING },
);
