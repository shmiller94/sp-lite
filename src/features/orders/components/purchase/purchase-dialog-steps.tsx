import React from 'react';

import {
  PURCHASE_DIALOG_STEPS,
  PurchaseDialogStepper,
  usePurchaseDialogStepper,
} from './purchase-dialog-stepper';
import * as Steps from './steps';

export const PurchaseDialogSteps = () => {
  return (
    <PurchaseDialogStepper.Scoped>
      <PurchaseDialogStepsContent />
    </PurchaseDialogStepper.Scoped>
  );
};

const PurchaseDialogStepsContent = (): React.ReactElement => {
  const methods = usePurchaseDialogStepper();

  return (
    <React.Fragment>
      {methods.switch({
        [PURCHASE_DIALOG_STEPS.INFO]: () => <Steps.ServiceDetailsStep />,
        [PURCHASE_DIALOG_STEPS.INFORMED_CONSENT]: () => (
          <Steps.InformedConsentStep />
        ),
        [PURCHASE_DIALOG_STEPS.EARLY_ACCESS]: () => (
          <Steps.RequestEarlyAccessStep />
        ),
        [PURCHASE_DIALOG_STEPS.SUMMARY]: () => <Steps.PurchaseSummaryStep />,
        [PURCHASE_DIALOG_STEPS.SUCCESS]: () => <Steps.PurchaseSuccessStep />,
      })}
    </React.Fragment>
  );
};
