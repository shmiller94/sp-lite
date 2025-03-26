import { useRef, useState, useEffect } from 'react';

import { cn } from '@/lib/utils';

interface HoverableCardProps {
  children: React.ReactNode;
  className?: string;
  backgroundImage?: string;
  userAvatarImage?: string;
  fallbackAvatarPath?: string;
  backgroundGradient?: string;
  disabled?: boolean;
  isLoading?: boolean;
  avatarOpacity?: number;
}

export const HoverableCard = ({
  children,
  className,
  backgroundImage,
  userAvatarImage,
  fallbackAvatarPath,
  backgroundGradient,
  disabled = false,
  isLoading = false,
  avatarOpacity = 0.6,
}: HoverableCardProps): JSX.Element => {
  const cardRef = useRef<HTMLDivElement>(null);
  const shimmerRef = useRef<HTMLDivElement>(null);
  const holographicPatternRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();

    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    let startTime: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      const rotateX = Math.sin(elapsed / 2000) * 5;
      const rotateY = Math.sin(elapsed / 3000) * 8;

      setRotation({ x: rotateX, y: rotateY });
      updateShimmerEffect(rotateX, rotateY);

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isMobile]);

  useEffect(() => {
    if (holographicPatternRef.current) {
      holographicPatternRef.current.style.backgroundImage = `
        repeating-linear-gradient(
          90deg,
          transparent,
          transparent 2px,
          rgba(255, 255, 255, 0.03) 2px,
          rgba(255, 255, 255, 0.03) 4px
        ),
        repeating-linear-gradient(
          180deg,
          transparent,
          transparent 2px,
          rgba(255, 255, 255, 0.03) 2px,
          rgba(255, 255, 255, 0.03) 4px
        )
      `;
    }
  }, []);

  useEffect(() => {
    setAvatarError(false);
  }, [userAvatarImage]);

  const updateShimmerEffect = (
    rotateX: number,
    rotateY: number,
    mouseX?: number,
    mouseY?: number,
  ) => {
    if (
      !shimmerRef.current ||
      !cardRef.current ||
      !holographicPatternRef.current
    )
      return;

    const viewingAngle = Math.sqrt(rotateX * rotateX + rotateY * rotateY);

    if (viewingAngle < 1) {
      shimmerRef.current.style.opacity = '0';
      holographicPatternRef.current.style.opacity = '0.05';
      shimmerRef.current.style.boxShadow = 'none';
      return;
    }

    const angleThreshold = 2;
    const maxIntensity = 0.4;

    let normalizedIntensity = 0;
    if (viewingAngle > angleThreshold) {
      normalizedIntensity = Math.sin(
        ((viewingAngle - angleThreshold) / 7) * Math.PI,
      );
      normalizedIntensity = Math.max(0, Math.min(1, normalizedIntensity));
    }

    const intensity = normalizedIntensity * maxIntensity;

    shimmerRef.current.style.opacity = intensity > 0.025 ? '1' : '0';

    holographicPatternRef.current.style.opacity = (
      0.05 +
      intensity * 0.2
    ).toString();

    const rect = cardRef.current.getBoundingClientRect();
    let shimmerX = 0;
    let shimmerY = 0;

    if (mouseX !== undefined && mouseY !== undefined) {
      shimmerX = (mouseX / rect.width) * 100 - 50;
      shimmerY = (mouseY / rect.height) * 100 - 50;
    } else {
      shimmerX = rotateY * 5;
      shimmerY = -rotateX * 5;
    }

    const shimmerAngleX = 90 + rotateY * 15;
    const shimmerAngleY = rotateX * 15;

    const shimmerWidth = Math.max(10, 25 - viewingAngle);

    shimmerRef.current.style.background = `
      radial-gradient(
        circle at ${50 + shimmerX}% ${50 + shimmerY}%, 
        rgba(255, 255, 255, ${intensity * 0.8}) 0%, 
        rgba(255, 255, 255, ${intensity * 0.5}) 10%,
        transparent 40%
      ),
      linear-gradient(
        ${shimmerAngleX}deg, 
        transparent ${50 - shimmerWidth * 1.2}%, 
        rgba(255, 255, 255, ${intensity * 0.6}) 48%,
        rgba(255, 255, 255, ${intensity * 0.8}) 49%,
        rgba(255, 255, 255, ${intensity}) 50%,
        rgba(255, 255, 255, ${intensity * 0.8}) 51%,
        rgba(255, 255, 255, ${intensity * 0.6}) 52%,
        transparent ${50 + shimmerWidth * 1.2}%
      ),
      linear-gradient(
        ${shimmerAngleX + 2}deg, 
        transparent ${50 - shimmerWidth * 0.8}%, 
        rgba(255, 255, 255, ${intensity * 0.4}) 49%,
        rgba(255, 255, 255, ${intensity * 0.6}) 50%,
        rgba(255, 255, 255, ${intensity * 0.4}) 51%,
        transparent ${50 + shimmerWidth * 0.8}%
      ),
      linear-gradient(
        ${shimmerAngleY}deg, 
        transparent 45%, 
        rgba(255, 255, 255, ${intensity * 0.3}) 49.5%,
        rgba(255, 255, 255, ${intensity * 0.4}) 50%,
        rgba(255, 255, 255, ${intensity * 0.3}) 50.5%,
        transparent 55%
      )
    `;

    if (viewingAngle > 3) {
      const hue1 = (rotateY * 20 + 180) % 360;
      const hue2 = (hue1 + 30) % 360;

      shimmerRef.current.style.boxShadow = `
        inset 0 0 80px rgba(${hue1 < 180 ? hue1 : 360 - hue1}, ${Math.abs(hue1 - 120)}, ${Math.abs(hue1 - 240)}, ${viewingAngle * 0.015}),
        inset 0 0 120px rgba(${hue2 < 180 ? hue2 : 360 - hue2}, ${Math.abs(hue2 - 120)}, ${Math.abs(hue2 - 240)}, ${viewingAngle * 0.01})
      `;

      holographicPatternRef.current.style.transform = `rotate(${rotateY * 0.5}deg) scale(${1 + viewingAngle * 0.01})`;
    } else {
      shimmerRef.current.style.boxShadow = 'none';
      holographicPatternRef.current.style.transform = 'rotate(0deg) scale(1)';
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isMobile) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = ((x - centerX) / centerX) * 10;
    const rotateX = ((centerY - y) / centerY) * 10;

    setRotation({ x: rotateX, y: rotateY });

    updateShimmerEffect(rotateX, rotateY, x, y);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;

    setRotation({ x: 0, y: 0 });
    setIsHovered(false);

    if (shimmerRef.current) {
      shimmerRef.current.style.opacity = '0';
      shimmerRef.current.style.boxShadow = 'none';
    }

    if (holographicPatternRef.current) {
      holographicPatternRef.current.style.opacity = '0.05';
      holographicPatternRef.current.style.transform = 'rotate(0deg) scale(1)';
    }
  };

  const handleMouseEnter = () => {
    if (isMobile) return;
    setIsHovered(true);
  };

  const handleAvatarError = () => {
    setAvatarError(true);
  };

  const backgroundStyle = backgroundImage
    ? { backgroundImage: `url(${backgroundImage})` }
    : {};

  return (
    <div
      ref={cardRef}
      className={cn(
        'text-white flex flex-col justify-between bg-center p-5 w-full bg-cover rounded-2xl relative overflow-hidden',
        'transition-all duration-300 ease-out transform-gpu',
        'shadow-xl hover:shadow-2xl',
        disabled && 'grayscale opacity-50',
        isLoading && 'animate-pulse bg-muted',
        isMobile ? 'hover:shadow-xl' : '',
        className,
      )}
      style={{
        ...backgroundStyle,
        background: backgroundGradient,
        transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(${isHovered && !isMobile ? 1.02 : 1}, ${isHovered && !isMobile ? 1.02 : 1}, 1)`,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {(userAvatarImage || fallbackAvatarPath) && (
        <div
          ref={avatarRef}
          className="pointer-events-none absolute inset-0 size-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${avatarError || !userAvatarImage ? fallbackAvatarPath : userAvatarImage})`,
            opacity: avatarOpacity,
            mixBlendMode: 'overlay',
          }}
        >
          <div className="progressive-blur absolute inset-0 z-10 bg-white/75" />
          {userAvatarImage && (
            <img
              src={userAvatarImage}
              alt=""
              className="hidden"
              onError={handleAvatarError}
            />
          )}
        </div>
      )}

      <div
        ref={holographicPatternRef}
        className="pointer-events-none absolute inset-0 size-full"
        style={{
          opacity: '0.05',
          transition: 'opacity 0.3s ease-out, transform 0.2s ease-out',
        }}
      />

      <div
        ref={shimmerRef}
        className="pointer-events-none absolute inset-0 size-full"
        style={{
          opacity: '0',
          transition:
            'opacity 0.2s ease-out, background 0.1s ease-out, box-shadow 0.2s ease-out',
          mixBlendMode: 'overlay',
        }}
      />

      <div
        className="pointer-events-none relative z-10 flex h-full flex-col justify-between"
        style={{ transform: 'translateZ(20px)' }}
      >
        {children}
      </div>
    </div>
  );
};
