import { useCallback, useState } from 'react';

const RECOMMENDATION_COOKIE = 'recommendation:dismissed';
const RECOMMENDATION_MAX_AGE = 60 * 60 * 24 * 30; // 1 month in seconds

export const useRecommendationsVisibility = () => {
  // on first render, hide if our cookie exists
  const getInitial = () => {
    if (typeof document === 'undefined') return true;
    return !document.cookie
      .split('; ')
      .some((c) => c.startsWith(`${RECOMMENDATION_COOKIE}=`));
  };

  const [_isVisible, _setIsVisible] = useState(getInitial);

  const setIsVisible = useCallback(
    (value: boolean | ((prev: boolean) => boolean)) => {
      const next = typeof value === 'function' ? value(_isVisible) : value;
      // write the cookie whenever recommendations are dismissed
      document.cookie = [
        `${RECOMMENDATION_COOKIE}=${next ? '' : '1'}`,
        `path=/`,
        `max-age=${RECOMMENDATION_MAX_AGE}`,
      ].join('; ');
      _setIsVisible(next);
    },
    [_isVisible],
  );

  return { isVisible: _isVisible, setIsVisible };
};
