import {
  createUser,
  renderApp,
  screen,
  userEvent,
  waitFor,
} from '@/testing/test-utils';

import { LoginForm } from '../login-form';

// TODO: Update test for better-auth migration (ENG-13594). The password login
// flow now uses authClient.signIn.email instead of the legacy auth/login endpoint,
// and the mock infrastructure doesn't yet support the new flow.
test.skip('should login new user and call onSuccessWithPassword cb which should navigate the user to the app', async () => {
  const newUser = await createUser();

  const onSuccessWithPassword = vi.fn();
  const onSuccessWithMagicLink = vi.fn();

  await renderApp(
    <LoginForm
      onSuccessWithPassword={onSuccessWithPassword}
      onSuccessWithMagicLink={onSuccessWithMagicLink}
    />,
    { user: null, url: '/signin', path: '/signin' },
  );

  // Switch to password mode first since magic link is default
  await userEvent.click(screen.getByText(/Sign in with password instead/i));

  await userEvent.type(screen.getByPlaceholderText(/email/i), newUser.email);
  await userEvent.type(
    screen.getByPlaceholderText(/password/i),
    newUser.password,
  );

  await userEvent.click(screen.getByRole('button', { name: /Login/i }));

  await waitFor(() => expect(onSuccessWithPassword).toHaveBeenCalledTimes(1));
});
