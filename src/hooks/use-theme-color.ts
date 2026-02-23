import { useRouterState } from '@tanstack/react-router';
import { useEffect, useMemo, useRef } from 'react';

import { WHITE_BACKGROUND_PATHS } from '@/const/white-background-paths';

export function useThemeColor() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const lastColorRef = useRef<string | null>(null);

  const themeColor = useMemo(() => {
    let isWhiteBg = false;
    for (const path of WHITE_BACKGROUND_PATHS) {
      if (pathname.includes(path)) {
        isWhiteBg = true;
        break;
      }
    }
    return isWhiteBg ? '#ffffff' : '#fafafa';
  }, [pathname]);

  useEffect(() => {
    if (lastColorRef.current === themeColor) return;

    // set the body background color matching to theme color
    document.body.style.backgroundColor = themeColor;

    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', themeColor);
      lastColorRef.current = themeColor;
    }
  }, [themeColor]);
}
