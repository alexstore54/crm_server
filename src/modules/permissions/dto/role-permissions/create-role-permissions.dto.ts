import { UseValidation } from '@/common/decorators/validation';
import { IncomingPermission } from '@/modules/permissions/dto';

export class UpdateRolePermissions {
  @UseValidation.validatePermissionsArray()
  permissions: IncomingPermission[];
}
