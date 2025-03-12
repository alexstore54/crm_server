import { IsArray, IsNumber, ValidateIf, ValidateNested } from 'class-validator';

import { Type } from 'class-transformer';
import { UseValidation } from '@/common/decorators/validation';
import { IncomingPermission } from '@/modules/permissions/dto';

export class CreateAgentPermissions {
  @IsNumber()
  agentId: number;

  @UseValidation.validatePermissionsArray()
  permissions: IncomingPermission[];
}
