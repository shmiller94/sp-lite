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

// Test insertStepsAfter functionality
const renderStepperWithInsertSteps = () => {
  return render(
    <StepperStoreProvider
      steps={[
        { content: <div>Step 1</div>, id: 'step-1' },
        { content: <div>Step 2</div>, id: 'step-2' },
      ]}
    >
      <TestInsertStepsComponent />
    </StepperStoreProvider>,
  );
};

const TestInsertStepsComponent = () => {
  const { steps, insertStepsAfter } = useStepper((state) => state);

  useEffect(() => {
    insertStepsAfter('step-1', [
      { content: <div>Step 1.1</div>, id: 'step-1.1' },
      { content: <div>Step 1.2</div>, id: 'step-1.2' },
    ]);
  }, [insertStepsAfter]);

  return (
    <div>
      {steps.map((step) => (
        <div key={step.id}>{step.content}</div>
      ))}
    </div>
  );
};

test('should insert steps after a specific step ID', async () => {
  renderStepperWithInsertSteps();

  expect(await screen.findByText(/^Step 1$/)).toBeInTheDocument();
  expect(await screen.findByText(/^Step 1.1$/)).toBeInTheDocument();
  expect(await screen.findByText(/^Step 1.2$/)).toBeInTheDocument();
  expect(await screen.findByText(/^Step 2$/)).toBeInTheDocument();
});

const renderStepperWithDynamicSteps = () => {
  return render(
    <StepperStoreProvider
      steps={[{ content: <div>Step 1</div>, id: 'step-1' }]}
    >
      <TestDynamicStepsComponent />
    </StepperStoreProvider>,
  );
};

const TestDynamicStepsComponent = () => {
  const { steps, nextStep, insertStepsAfter, activeStep } = useStepper(
    (state) => state,
  );

  // Insert additional steps dynamically after the initial render
  useEffect(() => {
    insertStepsAfter('step-1', [
      { content: <div>Step 2</div>, id: 'step-2' },
      { content: <div>Step 3</div>, id: 'step-3' },
    ]);
  }, []); // `insertStepsAfter` is stable, so we omit it from dependencies.

  return (
    <div>
      {steps[activeStep]?.content}
      <button onClick={nextStep}>Next Step</button>
    </div>
  );
};

test('should render step 1, insert two additional steps, and navigate through them', async () => {
  const user = userEvent.setup();

  renderStepperWithDynamicSteps();

  // Step 1 should be initially rendered
  expect(await screen.findByText(/^Step 1$/)).toBeInTheDocument();

  // Click to navigate to Step 2
  await act(async () => {
    await user.click(await screen.findByRole('button', { name: /next step/i }));
  });

  // Verify Step 2 content is rendered
  expect(await screen.findByText(/^Step 2$/)).toBeInTheDocument();

  // Click to navigate to Step 3
  await act(async () => {
    await user.click(await screen.findByRole('button', { name: /next step/i }));
  });

  // Verify Step 3 content is rendered
  expect(await screen.findByText(/^Step 3$/)).toBeInTheDocument();
});
