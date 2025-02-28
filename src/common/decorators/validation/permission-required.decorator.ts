import { SetMetadata } from '@nestjs/common';
import { PermissionsKeys } from '@/shared/types/auth/permissions.type';
import { DECORATORS_METADATA } from '@/shared/constants/metadata';

export const SomePermissionRequired = (permissions: PermissionsKeys[]) =>
  SetMetadata(DECORATORS_METADATA.REQUIRED_PERMISSIONS, permissions);
