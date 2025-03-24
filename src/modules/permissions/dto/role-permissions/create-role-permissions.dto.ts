import { UseValidation } from '@/common/decorators/validation';
import { IncomingPermission } from '@/modules/permissions/dto';
import { IsNumber } from 'class-validator';

export class CreatRolePermissions {
  @IsNumber()
  roleId: number;

  @UseValidation.validatePermissionsArray()
  permissions: IncomingPermission[];
}
