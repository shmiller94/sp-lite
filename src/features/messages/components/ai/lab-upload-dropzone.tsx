import { Upload } from 'lucide-react';

import { cn } from '@/lib/utils';

export function LabUploadDropzone({
  isDragActive,
  onClick,
}: {
  isDragActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group mx-auto mb-1 flex w-full max-w-3xl flex-col items-center justify-center gap-2 rounded-2xl border border-dashed px-4 py-5 text-center outline-none transition-[border-color,background-color,box-shadow,color] duration-200 focus-visible:ring-2 focus-visible:ring-ring',
        isDragActive
          ? 'border-vermillion-800 bg-vermillion-50 shadow-[0_0_0_1px_rgba(252,95,43,0.28)]'
          : 'border-zinc-300 bg-zinc-50/80 hover:border-zinc-400 hover:bg-zinc-100/80',
      )}
    >
      <img
        src="/concierge/lab-upload.png"
        alt=""
        className="h-14 w-auto object-contain transition-all duration-300 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:scale-[1.03]"
      />
      <div
        className={cn(
          'flex items-center gap-2 text-sm font-medium',
          isDragActive ? 'text-vermillion-900' : 'text-zinc-500',
        )}
      >
        <Upload size={16} aria-hidden="true" />
        <span>Upload past labs</span>
      </div>
      <span className="text-xs text-zinc-500">
        Drop PDF files here or click
      </span>
    </button>
  );
}
