import { IsNumber } from 'class-validator';
import { IncomingPermission } from '@/modules/permissions/dto/agent-permissions/incoming-permission.dto';
import { UseValidator } from '@/common/decorators/validation';

export class CreateAgentPermissions {
  @IsNumber()
  agentId: number;

  @IsNumber()
  roleId: number;

  @UseValidator.validatePermissionsArray()
  permissions: IncomingPermission[];
}
