import { File } from '@/types/api';

export const CONTENT_TYPE_MAP: Record<File['contentType'], string> = {
  'application/pdf': 'PDF',
  'video/mp4': 'Video',
  'text/csv': 'CSV',
  'image/jpeg': 'Image',
  'image/png': 'Image',
  test: 'Test',
};

export const MEDIA_TYPES = ['image/jpeg', 'image/png', 'video/mp4'];

export const VIRTUAL_MEDIA_TYPE = 'media';
