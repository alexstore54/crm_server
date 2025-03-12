import { IsArray, IsNumber, ValidateIf, ValidateNested } from 'class-validator';
import { UseValidation } from '@/common/decorators/validation';
import { IncomingPermission } from '@/modules/permissions/dto/agent-permissions';
import { Type } from 'class-transformer';

export class CreateAgentPermissions {
  @IsNumber()
  agentId: number;

  @ValidateIf((o) => o.permissions !== null)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IncomingPermission)
  permissions: IncomingPermission[];
}
