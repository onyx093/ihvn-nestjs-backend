import { SetMetadata } from '@nestjs/common';

export const SUBJECT_METADATA = 'SUBJECT_METADATA';
export const Subject = (subject: string) =>
  SetMetadata(SUBJECT_METADATA, subject);
