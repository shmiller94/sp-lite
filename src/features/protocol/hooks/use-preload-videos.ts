import { useEffect, useRef } from 'react';

export const usePreloadVideos = (urls: string[], delayMs = 100) => {
  const preloadedVideos = useRef<HTMLVideoElement[]>([]);

  useEffect(() => {
    if (!urls.length) return;

    const timeouts: NodeJS.Timeout[] = [];
    const videos: HTMLVideoElement[] = [];

    urls.forEach((url, index) => {
      const timeout = setTimeout(() => {
        const video = document.createElement('video');
        video.preload = 'auto';
        video.muted = true;
        video.playsInline = true;
        video.src = url;
        videos.push(video);

        try {
          video.load();
        } catch (_) {
          /* empty */
        }
      }, index * delayMs);

      timeouts.push(timeout);
    });

    preloadedVideos.current = videos;

    return () => {
      timeouts.forEach(clearTimeout);
      videos.forEach((video) => {
        try {
          video.removeAttribute('src');
          video.load?.();
        } catch (_) {
          /* empty */
        }
      });
      preloadedVideos.current = [];
    };
  }, [urls, delayMs]);
};
