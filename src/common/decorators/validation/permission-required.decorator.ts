import { SetMetadata } from '@nestjs/common';
import { METADATA } from '@/shared/constants/metadata';
import { PermissionsKeys } from '@/shared/types/permissions';

export const UsePermissions = (permissions: PermissionsKeys[]) =>
  SetMetadata(METADATA.REQUIRED_PERMISSIONS, permissions);
