import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { useOnboardingCartStore } from '../onboarding-cart-store';

describe('useOnboardingCartStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useOnboardingCartStore.getState().clear();
  });

  it('adds panel ids idempotently', () => {
    const { result } = renderHook(() => useOnboardingCartStore());

    act(() => {
      result.current.addPanel('panel-a');
      result.current.addPanel('panel-a');
    });

    expect(result.current.selectedPanelIds.size).toBe(1);
    expect(result.current.selectedPanelIds.has('panel-a')).toBe(true);
  });

  it('persists selected panel ids as a string array', () => {
    const { result } = renderHook(() => useOnboardingCartStore());

    act(() => {
      result.current.addPanel('panel-a');
      result.current.addPanel('panel-b');
    });

    const stored = localStorage.getItem('onboarding-cart-store');
    expect(stored).not.toBeNull();

    let parsedState: unknown = null;
    if (stored !== null) {
      const parsed = JSON.parse(stored);
      if (typeof parsed === 'object' && parsed !== null && 'state' in parsed) {
        parsedState = parsed.state;
      }
    }

    expect(parsedState).toEqual({
      selectedPanelIds: ['panel-a', 'panel-b'],
    });
  });

  it('rehydrates persisted panel ids into a Set', async () => {
    localStorage.setItem(
      'onboarding-cart-store',
      JSON.stringify({
        state: {
          selectedPanelIds: ['panel-a', 'panel-b'],
        },
        version: 0,
      }),
    );

    await act(async () => {
      await useOnboardingCartStore.persist.rehydrate();
    });

    const { result } = renderHook(() => useOnboardingCartStore());
    expect(result.current.selectedPanelIds instanceof Set).toBe(true);
    expect(result.current.selectedPanelIds.size).toBe(2);
    expect(result.current.selectedPanelIds.has('panel-a')).toBe(true);
    expect(result.current.selectedPanelIds.has('panel-b')).toBe(true);
  });

  it('clears selected panel ids', () => {
    const { result } = renderHook(() => useOnboardingCartStore());

    act(() => {
      result.current.addPanel('panel-a');
      result.current.clear();
    });

    expect(result.current.selectedPanelIds.size).toBe(0);
  });
});
