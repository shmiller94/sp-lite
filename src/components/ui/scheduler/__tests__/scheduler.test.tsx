import * as React from 'react';

import { rtlRender, screen } from '@/testing/test-utils';

import { Scheduler } from '../scheduler';

test('One slot', async () => {
  const now = new Date();
  const month = now.toLocaleString('default', { month: 'long' });

  const slots = [
    {
      start: now.toISOString(),
      end: new Date(now.getTime() + 15 * 60 * 1000).toISOString(), // 15 minutes later
    },
  ];

  rtlRender(
    <Scheduler
      slots={slots}
      updateStart={() => {
        console.log('updated slots');
      }}
      onSlotUpdate={(appt: unknown): void => {
        console.log(`${appt}`);
      }}
    />,
  );

  expect(screen.getByText(month)).toBeInTheDocument();
  expect(screen.getByText('1 slots')).toBeInTheDocument();
  expect(screen.getAllByText('No slots').length).toBe(4);
});

test('No slots', async () => {
  rtlRender(
    <Scheduler
      slots={[]}
      updateStart={() => {
        console.log('updated slots');
      }}
      onSlotUpdate={(appt: unknown): void => {
        console.log(`${appt}`);
      }}
    />,
  );

  // Get all elements with the text "No slots"
  const noSlotsElements = screen.getAllByText('No slots');

  // Assert the number of elements found
  expect(noSlotsElements.length).toBe(5);

  expect(screen.queryByText('1 slots')).not.toBeInTheDocument();
});
