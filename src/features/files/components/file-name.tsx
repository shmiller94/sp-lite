import {
  CsvFileIcon,
  Mp4FileIcon,
  PdfFileIcon,
  UnknownFileIcon,
} from '@/components/icons';
import { File } from '@/types/api';

export function FileName({ file }: { file: File }): JSX.Element {
  const extension = (): JSX.Element => {
    switch (file.contentType) {
      case 'application/pdf':
        return <PdfFileIcon />;
      case 'text/csv':
        return <CsvFileIcon />;
      case 'video/mp4':
        return <Mp4FileIcon />;
      default:
        return <UnknownFileIcon />;
    }
  };

  return (
    <>
      <div>{extension()}</div>
      <h3 className="mx-2 line-clamp-1 text-[#3F3F46] md:group-hover:text-[#FC5F2B]">
        {file.name}
      </h3>
    </>
  );
}
