import { useEffect } from 'react';

export const usePreloadVideo = (url?: string) => {
  useEffect(() => {
    if (!url) return;

    const video = document.createElement('video');
    video.preload = 'auto';
    video.muted = true;
    video.playsInline = true;
    video.src = url;
    try {
      video.load();
    } catch (_) {
      /* empty */
    }

    return () => {
      try {
        video.removeAttribute('src');
        video.load?.();
      } catch (_) {
        /* empty */
      }
    };
  }, [url]);
};
