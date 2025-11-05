import { useEffect } from 'react';

type HotkeyOptions = {
  key: string;
  ctrlOrMeta?: boolean;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
  preventDefault?: boolean;
  handler: (event: KeyboardEvent) => void;
};

export function useHotkey({
  key,
  ctrlOrMeta,
  ctrl,
  meta,
  shift,
  alt,
  preventDefault,
  handler,
}: HotkeyOptions) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const keyMatch = event.key.toLowerCase() === key.toLowerCase();

      const modifierMatch = ctrlOrMeta
        ? event.ctrlKey || event.metaKey
        : (!meta || event.metaKey) &&
          (!ctrl || event.ctrlKey) &&
          (!shift || event.shiftKey) &&
          (!alt || event.altKey);

      if (keyMatch && modifierMatch) {
        if (preventDefault) event.preventDefault();
        handler(event);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [key, ctrlOrMeta, ctrl, meta, shift, alt, preventDefault, handler]);
}
