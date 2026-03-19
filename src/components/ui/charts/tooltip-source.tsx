import { useOpenFile } from '@/features/files/hooks/use-open-file';

interface TooltipSourceProps {
  source: string;
  file?: { id: string; name: string; contentType?: string };
}

export function TooltipSource({ source, file }: TooltipSourceProps) {
  const openFile = useOpenFile();

  if (!file) {
    return <span className="capitalize">{source}</span>;
  }

  return (
    <>
      <span className="capitalize">{source}</span>
      {' — '}
      <button
        type="button"
        className="cursor-pointer underline decoration-dotted underline-offset-2 hover:text-foreground focus:outline-none"
        onClick={(event) => {
          event.stopPropagation();
          openFile(file.id, { contentType: file.contentType });
        }}
      >
        {file.name}
      </button>
    </>
  );
}
