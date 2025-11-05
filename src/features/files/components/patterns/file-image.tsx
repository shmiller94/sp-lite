import { Rive, useRive } from '@rive-app/react-canvas-lite';

import { File } from '@/types/api';

// This component is used to wrap the Rive component and add a hover effect
const AnimationWrapper = ({
  RiveComponent,
  animation,
}: {
  RiveComponent: React.ComponentType<any>;
  animation: Rive | null;
  className?: string;
}) => {
  return (
    <div className="group relative size-full">
      <RiveComponent
        onMouseEnter={() => {
          animation?.reset({
            artboard: animation?.activeArtboard,
          });
          animation?.play();
        }}
        className="absolute -top-8 z-[1] size-full"
      />
      {/* Vector shadows don't exist, so we use a div to create a shadow */}
      <div className="absolute inset-0 left-1/2 top-1/2 z-0 -mt-4 size-full h-12 w-16 -translate-x-1/2 -translate-y-1/2 bg-black/10 blur-xl transition-all duration-500 group-hover:bg-black/20 md:h-8 md:w-1/2" />
    </div>
  );
};

// This component is used to display the file images
export const FileImage = ({ file }: { file: File }) => {
  const { rive: imageAnimation, RiveComponent: Image } = useRive({
    src: '/animations/file-animations.riv',
    artboard: 'image',
    autoplay: false,
  });

  const { rive: csvAnimation, RiveComponent: Csv } = useRive({
    src: '/animations/file-animations.riv',
    artboard: 'csv',
    autoplay: false,
  });

  const { rive: videoAnimation, RiveComponent: Video } = useRive({
    src: '/animations/file-animations.riv',
    artboard: 'video',
    autoplay: false,
  });

  // If the file as an image, we return its image
  if (file.image) {
    return (
      <img
        src={file.image}
        alt={file.name}
        className="h-3/4 w-full object-contain"
      />
    );
  }

  // If the file is a PDF, we return a doc stack
  if (file.contentType === 'application/pdf') {
    return (
      <div className="group relative size-full">
        <img
          src="/data/file-fallback.webp"
          alt={file.name}
          className="absolute inset-0 left-1/2 top-1/2 z-[2] -mt-4 h-[20vw] -translate-x-1/2 -translate-y-1/2 object-cover transition-all duration-500 ease-out group-hover:-ml-4 group-hover:-rotate-6 md:-mt-6 md:h-32"
        />
        <img
          src="/data/file-fallback.webp"
          alt={file.name}
          className="absolute inset-0 left-1/2 top-1/2 z-[1] -mt-4 ml-4 h-[20vw] -translate-x-1/2 -translate-y-1/2 rotate-6 scale-95 object-cover transition-all duration-500 ease-out group-hover:ml-6 group-hover:rotate-6 md:-mt-6 md:h-32"
        />
        <div className="absolute inset-0 left-1/2 top-1/2 z-0 -mt-4 size-full h-12 w-16 -translate-x-1/2 -translate-y-1/2 bg-black/5 blur-xl transition-all duration-500 group-hover:bg-black/15 md:h-8 md:w-1/2" />
      </div>
    );
  }

  // If the file is an image, we return a custom rive animation
  if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
    return (
      <AnimationWrapper RiveComponent={Image} animation={imageAnimation} />
    );
  }

  // If the file is a CSV, we return a custom rive animation
  if (file.contentType === 'text/csv') {
    return <AnimationWrapper RiveComponent={Csv} animation={csvAnimation} />;
  }

  // If the file is a video, we return a custom rive animation
  if (file.contentType === 'video/mp4') {
    return (
      <AnimationWrapper RiveComponent={Video} animation={videoAnimation} />
    );
  }

  return null;
};
