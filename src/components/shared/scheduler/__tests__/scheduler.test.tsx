import { renderApp, screen } from '@/testing/test-utils';

import { Scheduler } from '../scheduler';

test('One slot', async () => {
  await renderApp(
    <Scheduler
      collectionMethod="AT_HOME"
      address={{
        id: '1',
        city: 'test',
        state: 'test',
        postalCode: '12345',
        line: ['test'],
        use: 'home',
      }}
    />,
  );
  expect(screen.queryByText(/We were unable/i)).not.toBeInTheDocument();
});
