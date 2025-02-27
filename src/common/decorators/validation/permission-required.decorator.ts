import { SetMetadata } from '@nestjs/common';
import { PermissionsKeys } from '@/shared/types/auth/permissions.type';
import { DECORATORS_METADATA } from '@/shared/constants/metadata';

export const PermissionRequired = (permission: PermissionsKeys) =>
  SetMetadata(DECORATORS_METADATA.REQUIRED_PERMISSION, permission);
