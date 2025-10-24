import { renderApp, screen } from '@/testing/test-utils';

import { Scheduler } from '../scheduler';

test('One slot', async () => {
  await renderApp(
    <Scheduler
      service={{
        id: 'custom-blood-panel-labcorp',
        name: 'Custom Blood Panel',
        description:
          'Build your own blood panel and choose from dozens of laboratory tests covering hundreds of biomarkers.',
        price: 0,
        active: false,
        additionalClassification: [],
        phlebotomy: true,
        supportsLabOrder: true,
        bloodTubeCount: 6,
      }}
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
