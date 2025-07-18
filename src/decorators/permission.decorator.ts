import { SetMetadata } from '@nestjs/common';

export const PERMISSION_METADATA = 'PERMISSION_METADATA';
export const Permission = (permission: string) =>
  SetMetadata(PERMISSION_METADATA, permission);
