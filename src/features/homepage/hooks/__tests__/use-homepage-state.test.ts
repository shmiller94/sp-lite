import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useOrders } from '@/features/orders/api';
import { useCredits } from '@/features/orders/api/credits';
import { useWearables } from '@/features/settings/api/get-wearables';
import { useSummarySuspense } from '@/features/summary/api/get-summary';
import { useIsMobile } from '@/hooks/use-mobile';

import { useHomepageState } from '../use-homepage-state';

vi.mock('@/features/orders/api', () => ({
  useOrders: vi.fn(),
}));

vi.mock('@/features/orders/api/credits', () => ({
  useCredits: vi.fn(),
}));

vi.mock('@/features/summary/api/get-summary', () => ({
  useSummarySuspense: vi.fn(),
}));

vi.mock('@/features/settings/api/get-wearables', () => ({
  useWearables: vi.fn(),
}));

vi.mock('@/hooks/use-mobile', () => ({
  useIsMobile: vi.fn(),
}));

const useSummarySuspenseMock = vi.mocked(useSummarySuspense, { partial: true });
const useOrdersMock = vi.mocked(useOrders, { partial: true });
const useCreditsMock = vi.mocked(useCredits, { partial: true });
const useWearablesMock = vi.mocked(useWearables, { partial: true });
const useIsMobileMock = vi.mocked(useIsMobile, { partial: true });

describe('useHomepageState', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    useSummarySuspenseMock.mockReturnValue({
      data: {
        hasCompletedCarePlan: false,
        completedCarePlans: 0,
        hasPartialResults: false,
        partialDiagnosticReports: 0,
      },
    });

    useOrdersMock.mockReturnValue({
      data: { requestGroups: [] },
      isLoading: false,
    });

    useCreditsMock.mockReturnValue({
      data: { credits: [] },
      isLoading: false,
    });

    useWearablesMock.mockReturnValue({
      data: { wearables: [] },
      isLoading: false,
    });

    useIsMobileMock.mockReturnValue(false);
  });

  it('treats available redraws as actionable dashboard tasks', () => {
    useCreditsMock.mockReturnValue({
      data: {
        credits: [
          {
            id: 'credit-1',
            serviceId: 'service-1',
            serviceName: 'Superpower Blood Panel',
          },
        ],
      },
      isLoading: false,
    });

    const { result } = renderHook(() => useHomepageState(), {
      wrapper: createWrapper(),
    });

    expect(result.current.state.hasActionableOrders).toBe(true);
    expect(
      result.current.visibleCards.some((card) => card.id === 'actionableCards'),
    ).toBe(true);
  });

  it('keeps the actionable task card registered even when there are no current tasks', () => {
    const { result } = renderHook(() => useHomepageState(), {
      wrapper: createWrapper(),
    });

    expect(
      result.current.visibleCards.some((card) => card.id === 'actionableCards'),
    ).toBe(true);
  });
});

function createWrapper() {
  const queryClient = new QueryClient();

  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(
      QueryClientProvider,
      { client: queryClient },
      children,
    );
  };
}
