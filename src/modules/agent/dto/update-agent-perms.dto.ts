import { UseValidator } from '@/common/decorators/validation';
import { IncomingPermission } from '@/modules/permissions/dto/agent-permissions';

export class UpdateAgentPermissions {
  @UseValidator.validatePermissionsArray()
  permissions: IncomingPermission[];
}
