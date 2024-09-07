import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useEffect } from 'react';

import { StepperStoreProvider, useStepper } from '../stepper';

const renderEmptyStepperWithContext = () => {
  return render(
    <StepperStoreProvider steps={[]}>
      <TestEmptyComponent />
    </StepperStoreProvider>,
  );
};

const TestEmptyComponent = () => {
  const { activeStep, nextStep, prevStep } = useStepper((state) => state);

  return (
    <div>
      <h2>Stepper Store Context</h2>
      <h4>{activeStep}</h4>
      <button onClick={nextStep}>One step up</button>
      <button onClick={prevStep}>One step down</button>
    </div>
  );
};

test('should render with initial state of 0', async () => {
  renderEmptyStepperWithContext();

  expect(await screen.findByText(/^0$/)).toBeInTheDocument();
  expect(
    await screen.findByRole('button', { name: /one step up/i }),
  ).toBeInTheDocument();
});

test('should increase count by clicking a button', async () => {
  const user = userEvent.setup();

  renderEmptyStepperWithContext();

  expect(await screen.findByText(/^0$/)).toBeInTheDocument();

  await act(async () => {
    await user.click(
      await screen.findByRole('button', { name: /one step up/i }),
    );
  });

  expect(await screen.findByText(/^1$/)).toBeInTheDocument();
});

test('should decrease count by clicking a button', async () => {
  const user = userEvent.setup();

  renderEmptyStepperWithContext();

  expect(await screen.findByText(/^0$/)).toBeInTheDocument();

  await act(async () => {
    await user.click(
      await screen.findByRole('button', { name: /one step up/i }),
    );
  });

  expect(await screen.findByText(/^1$/)).toBeInTheDocument();

  await act(async () => {
    await user.click(
      await screen.findByRole('button', { name: /one step down/i }),
    );
  });

  expect(await screen.findByText(/^0$/)).toBeInTheDocument();
});

const renderStepperWithContext = () => {
  return render(
    <StepperStoreProvider
      steps={[
        { content: <div>Step 1</div>, id: 'step-1' },
        { content: <div>Step 2</div>, id: 'step-2' },
      ]}
    >
      <TestComponent />
    </StepperStoreProvider>,
  );
};

const TestComponent = () => {
  const { steps, nextStep, activeStep } = useStepper((state) => state);

  return (
    <div>
      {steps[activeStep].content}
      <button onClick={nextStep}>One step up</button>
    </div>
  );
};

test('should render first content item in steps', async () => {
  renderStepperWithContext();

  expect(await screen.findByText(/^Step 1$/)).toBeInTheDocument();
});

test('should render first content item and then second on click', async () => {
  const user = userEvent.setup();

  renderStepperWithContext();

  expect(await screen.findByText(/^Step 1$/)).toBeInTheDocument();

  await act(async () => {
    await user.click(
      await screen.findByRole('button', { name: /one step up/i }),
    );
  });

  expect(await screen.findByText(/^Step 2$/)).toBeInTheDocument();
});

const renderStepperWithSkipStepWithContext = () => {
  return render(
    <StepperStoreProvider
      steps={[
        { content: <UseEffectComponent />, id: 'step-1' },
        { content: <div>Step 2</div>, id: 'step-2' },
      ]}
    >
      <TestSkipComponent />
    </StepperStoreProvider>,
  );
};

const TestSkipComponent = () => {
  const { steps, activeStep } = useStepper((state) => state);

  return <div>{steps[activeStep].content}</div>;
};

const UseEffectComponent = () => {
  const { nextStep } = useStepper((state) => state);
  useEffect(() => {
    nextStep();
  }, []);

  return <div>Step 1</div>;
};

test('should skip step', async () => {
  renderStepperWithSkipStepWithContext();

  expect(screen.queryByText(/^Step 1$/)).not.toBeInTheDocument();

  expect(await screen.findByText(/^Step 2$/)).toBeInTheDocument();
});
