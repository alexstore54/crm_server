import { UseValidation } from '@/common/decorators/validation';
import { IncomingPermission } from '@/modules/permissions/dto';

export class UpdateAgentPermissions {
  @UseValidation.validatePermissionsArray()
  permissions: IncomingPermission[];
}
