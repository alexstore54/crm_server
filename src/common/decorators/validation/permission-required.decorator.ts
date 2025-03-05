import { SetMetadata } from '@nestjs/common';
import { PermissionsKeys } from '@/shared/types/auth/permissions.type';
import { METADATA } from '@/shared/constants/metadata';

export const UsePermissions = (permissions: PermissionsKeys[]) =>
  SetMetadata(METADATA.REQUIRED_PERMISSIONS, permissions);
