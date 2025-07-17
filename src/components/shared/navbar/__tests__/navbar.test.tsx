import * as React from 'react';

import { createUser, renderApp, screen, userEvent } from '@/testing/test-utils';

import { Navbar } from '../navbar';

test('Check if logout btn is present', async () => {
  const user = await createUser({
    admin: true,
  });

  await renderApp(<Navbar />, { user });

  expect(await screen.findByTestId('navbar-more-btn')).toBeInTheDocument();

  await userEvent.click(await screen.findByTestId('navbar-more-btn'));

  expect(await screen.findByText('Log out')).toBeInTheDocument();

  // let userEvent click() see body as interactive temporarily
  document.body.style.pointerEvents = 'auto';

  await userEvent.click(document.body);

  await userEvent.click(await screen.findByTestId('marketplaces-btn'));

  expect(
    await screen.findByTestId('supplements-icon-desktop'),
  ).toBeInTheDocument();

  expect(
    await screen.findByTestId('prescriptions-icon-desktop'),
  ).toBeInTheDocument();
});
