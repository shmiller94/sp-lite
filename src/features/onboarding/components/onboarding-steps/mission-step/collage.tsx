import { useEffect, useState } from 'react';

const collageSequence = [
  {
    image: '/onboarding/mission/collage-1.webp',
  },
  {
    image: '/onboarding/mission/collage-2.webp',
  },
  {
    image: '/onboarding/mission/collage-3.webp',
  },
  {
    image: '/onboarding/mission/collage-4.webp',
  },
  {
    image: '/onboarding/mission/collage-5.webp',
  },
  {
    image: '/onboarding/mission/collage-6.webp',
  },
  {
    image: '/onboarding/mission/collage-7.webp',
  },
  {
    image: '/onboarding/mission/collage-8.webp',
  },
];

export const Collage = ({
  setSequence,
}: {
  setSequence: (sequence: number) => void;
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageSize, setImageSize] = useState(100);

  useEffect(() => {
    const interval = setInterval(
      () => {
        setCurrentImageIndex((prevIndex) => {
          const nextIndex = prevIndex + 1;

          if (nextIndex >= collageSequence.length) {
            clearInterval(interval);
            setSequence(3);
            return prevIndex;
          }

          setImageSize((prevSize) =>
            Math.min(
              prevIndex < 2
                ? prevSize + 40
                : prevIndex < 4
                  ? prevSize + 80
                  : prevSize + 160,
              4000,
            ),
          );
          return nextIndex;
        });
      },
      currentImageIndex < 2 ? 200 : currentImageIndex < 4 ? 150 : 100,
    );

    return () => clearInterval(interval);
  }, [currentImageIndex, setSequence]);

  return (
    <div className="absolute inset-0 z-20 flex h-screen w-screen items-center justify-center">
      {collageSequence.map((item, index) => (
        <img
          key={index}
          src={item.image}
          alt="Collage"
          className="absolute"
          style={{
            opacity: index === currentImageIndex ? 1 : 0,
            transform: `scale(${index === currentImageIndex ? 1 : 0})`,
            width: `${imageSize}px`,
          }}
        />
      ))}
    </div>
  );
};
