export const Avatar = ({
  src,
  size = 'md',
  className,
  ...props
}: {
  src?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={`aspect-square cursor-pointer overflow-hidden rounded-full outline outline-1 -outline-offset-1 outline-black/10 ${className || ''}`}
      {...props}
    >
      <img
        src={src || '/user/fallback-avatar.webp'}
        alt="avatar"
        width={size === 'sm' ? 28 : size === 'md' ? 32 : 40}
        height={size === 'sm' ? 28 : size === 'md' ? 32 : 40}
      />
    </div>
  );
};
