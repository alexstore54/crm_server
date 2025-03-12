import { UseValidation } from '@/common/decorators/validation';
import { IncomingPermission } from '@/modules/permissions/dto/agent-permissions';

export class UpdateAgentPermissions {
  @UseValidation.validatePermissionsArray()
  permissions: IncomingPermission[];
}
