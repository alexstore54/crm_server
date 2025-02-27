import { IsArray, IsNumber, IsOptional, ValidateIf, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IsOnePropertyRequired } from '@/common/decorators/validation';
import { IncomingPermission } from '@/modules/permissions/dto/agent-permissions';

export class UpdateAgentPerms {
  @IsOnePropertyRequired()
  @IsOptional()
  @IsNumber()
  roleId?: number;

  @IsOnePropertyRequired()
  @IsOptional()
  @ValidateIf((o) => o.permissions !== null)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IncomingPermission)
  permissions?: IncomingPermission[];
}
