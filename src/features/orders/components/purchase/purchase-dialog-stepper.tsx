import { defineStepper } from '@stepperize/react';

import {
  GRAIL_GALLERI_MULTI_CANCER_TEST,
  CONTINUOUS_GLUCOSE_MONITOR,
  GUT_MICROBIOME_ANALYSIS,
  TOTAL_TOXIN_TEST,
  ENVIRONMENTAL_TOXINS_TEST,
  MYCOTOXINS_TEST,
  HEAVY_METALS_TEST,
} from '@/const';

import { usePurchaseStore } from '../../stores/purchase-store';

export const PURCHASE_DIALOG_STEPS = {
  INFO: 'info',
  INFORMED_CONSENT: 'informed-consent',
  SUMMARY: 'summary',
  SUCCESS: 'success',
  EARLY_ACCESS: 'early-access',
} as const satisfies Record<string, string>;

export const PurchaseDialogStepper = defineStepper(
  { id: PURCHASE_DIALOG_STEPS.INFO },
  { id: PURCHASE_DIALOG_STEPS.EARLY_ACCESS },
  { id: PURCHASE_DIALOG_STEPS.INFORMED_CONSENT },
  { id: PURCHASE_DIALOG_STEPS.SUMMARY },
  { id: PURCHASE_DIALOG_STEPS.SUCCESS },
);

type PurchaseDialogStepperUseStepperType = ReturnType<
  typeof PurchaseDialogStepper.useStepper
>;

type PurchaseDialogStepId =
  (typeof PURCHASE_DIALOG_STEPS)[keyof typeof PURCHASE_DIALOG_STEPS];

type UsePurchaseDialogStepperType = PurchaseDialogStepperUseStepperType & {
  validSteps: { id: PurchaseDialogStepId }[];
};

export const usePurchaseDialogStepper = (): UsePurchaseDialogStepperType => {
  const service = usePurchaseStore((s) => s.service);

  const methods = PurchaseDialogStepper.useStepper();

  let steps: { id: PurchaseDialogStepId }[] = [];

  switch (service.name) {
    case GRAIL_GALLERI_MULTI_CANCER_TEST:
    case CONTINUOUS_GLUCOSE_MONITOR:
    case GUT_MICROBIOME_ANALYSIS:
    case TOTAL_TOXIN_TEST:
    case ENVIRONMENTAL_TOXINS_TEST:
    case MYCOTOXINS_TEST:
    case HEAVY_METALS_TEST:
      steps = [
        { id: PURCHASE_DIALOG_STEPS.INFO },
        { id: PURCHASE_DIALOG_STEPS.INFORMED_CONSENT },
        { id: PURCHASE_DIALOG_STEPS.SUMMARY },
        { id: PURCHASE_DIALOG_STEPS.SUCCESS },
      ];
      break;
    default:
      steps = [
        { id: PURCHASE_DIALOG_STEPS.INFO },
        { id: PURCHASE_DIALOG_STEPS.SUMMARY },
        { id: PURCHASE_DIALOG_STEPS.SUCCESS },
      ];
  }

  const validSteps: { id: PurchaseDialogStepId }[] = service.active
    ? steps
    : [
        { id: PURCHASE_DIALOG_STEPS.INFO },
        { id: PURCHASE_DIALOG_STEPS.EARLY_ACCESS },
      ];

  const getCurrentIndex = () =>
    validSteps.findIndex((step) => step.id === methods.current.id);

  const next = () => {
    const idx = getCurrentIndex();
    if (idx === -1) return;

    const nextStep = validSteps[idx + 1];
    if (!nextStep) return;

    methods.goTo(nextStep.id);
  };

  const prev = () => {
    const idx = getCurrentIndex();
    if (idx === -1) return;

    const prevStep = validSteps[idx - 1];
    if (!prevStep) return;

    methods.goTo(prevStep.id);
  };

  const isLast = getCurrentIndex() === validSteps.length - 1;

  return {
    ...methods,
    next,
    prev,
    isLast,
    validSteps,
  };
};
