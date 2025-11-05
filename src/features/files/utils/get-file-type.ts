import { File } from '@/types/api';

import { CONTENT_TYPE_MAP, MEDIA_TYPES } from '../const/content-type';

export const getFileTypeName = (file: File): string => {
  const isMediaType = MEDIA_TYPES.includes(file.contentType);
  if (isMediaType) return 'Media';
  if (file.contentType === 'text/csv') return 'Data';
  if (file.contentType === 'application/pdf') return 'PDF';
  return CONTENT_TYPE_MAP[file.contentType] || file.contentType;
};
