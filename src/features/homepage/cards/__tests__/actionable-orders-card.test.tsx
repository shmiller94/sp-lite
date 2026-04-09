import { useSuspenseQuery } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ActionableOrdersCard } from '../actionable-orders-card';

const navigateMock = vi.fn();

vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual<typeof import('@tanstack/react-router')>(
    '@tanstack/react-router',
  );

  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual<typeof import('@tanstack/react-query')>(
    '@tanstack/react-query',
  );
  return { ...actual, useSuspenseQuery: vi.fn() };
});

vi.mock('@/features/orders/api/credits', () => ({
  getCreditsQueryOptions: vi.fn(() => ({ queryKey: ['credits', 'default'] })),
}));

vi.mock('@/features/redraw/api/get-redraws', () => ({
  getRedrawsQueryOptions: vi.fn(() => ({ queryKey: ['redraws'] })),
}));

const useSuspenseQueryMock = vi.mocked(useSuspenseQuery);

describe('ActionableOrdersCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    navigateMock.mockReset();

    useSuspenseQueryMock.mockImplementation(
      ({ queryKey }: { queryKey: readonly unknown[] }) => {
        if (queryKey[0] === 'credits')
          return { data: { credits: [] } } as ReturnType<
            typeof useSuspenseQuery
          >;
        return { data: { redraws: [] } } as ReturnType<typeof useSuspenseQuery>;
      },
    );
  });

  it('renders a recollection task when an available redraw exists', async () => {
    useSuspenseQueryMock.mockImplementation(
      ({ queryKey }: { queryKey: readonly unknown[] }) => {
        if (queryKey[0] === 'credits')
          return { data: { credits: [] } } as ReturnType<
            typeof useSuspenseQuery
          >;
        return {
          data: {
            redraws: [
              {
                serviceRequestId: 'sr-redraw-1',
                serviceRequestIds: ['sr-redraw-1'],
                redrawStatus: 'requisition_created',
                serviceNames: ['Superpower Blood Panel'],
                missingBiomarkers: ['Apolipoprotein B'],
                canSchedule: true,
                canSkip: true,
                canCancel: false,
              },
            ],
          },
        } as ReturnType<typeof useSuspenseQuery>;
      },
    );

    render(<ActionableOrdersCard />);

    expect(screen.getByText('You have 1 task')).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole('button', { name: /you have 1 task/i }),
    );

    expect(screen.getByText('Recollection Available')).toBeInTheDocument();
    expect(
      screen.getByText('Recollect your missing tests'),
    ).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole('button', {
        name: /recollection available recollect your missing tests/i,
      }),
    );

    expect(navigateMock).toHaveBeenCalledWith({
      to: '/recollection/$serviceRequestId',
      params: { serviceRequestId: 'sr-redraw-1' },
    });
  });
});
