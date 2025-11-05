import { RiveFile, useRive } from '@rive-app/react-canvas-lite';

export const RiveAnimation = ({
  riveFile,
  autoplay,
  artboard,
  animations,
  className,
}: {
  riveFile: RiveFile | null;
  autoplay?: boolean;
  artboard: string;
  animations: string | string[];
  className?: string;
}) => {
  const { RiveComponent } = useRive({
    riveFile: riveFile ?? undefined,
    autoplay,
    artboard,
    animations,
  });

  return <RiveComponent className={className} />;
};
