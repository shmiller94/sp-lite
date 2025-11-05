import { Search, X } from 'lucide-react';
import { useRef } from 'react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type MarketplaceSearchProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export const MarketplaceSearch = ({
  value,
  onChange,
  placeholder = 'Search anything',
  className,
}: MarketplaceSearchProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  const showClearButton = value.trim().length > 0;

  return (
    <div className={cn('relative', className)}>
      <Search className="pointer-events-none absolute left-5 top-1/2 size-[18px] -translate-y-1/2 text-zinc-400" />
      <Input
        ref={inputRef}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-10 rounded-full border-none bg-zinc-100 px-12 font-normal text-primary caret-primary shadow-none transition-none placeholder:text-zinc-400 focus:outline-none focus:ring-0 focus:ring-transparent focus:ring-offset-0 focus:transition-none focus-visible:bg-zinc-100 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 md:h-11"
      />
      {showClearButton ? (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-zinc-400 transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-100"
          aria-label="Clear search"
        >
          <X className="size-4" />
        </button>
      ) : null}
    </div>
  );
};
