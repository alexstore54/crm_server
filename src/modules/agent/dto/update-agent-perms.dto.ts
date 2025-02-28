import { IsNumber, IsOptional } from 'class-validator';
import { IsOnePropertyRequired, UserValidation } from '@/common/decorators/validation';
import { IncomingPermission } from '@/modules/permissions/dto/agent-permissions';

export class UpdateAgentPerms {
  @IsOnePropertyRequired()
  @IsOptional()
  @IsNumber()
  roleId?: number;

  @IsOnePropertyRequired()
  @IsOptional()
  @UserValidation.validatePermissionsArray()
  permissions?: IncomingPermission[];
}
