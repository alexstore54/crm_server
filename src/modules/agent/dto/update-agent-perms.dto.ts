import { IsArray, IsNumber, IsOptional, ValidateIf, ValidateNested } from 'class-validator';
import { AgentPermissionDto } from './create-agent.dto';
import { Type } from 'class-transformer';
import { IsOnePropertyRequired } from '@/common/decorators';

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
  @Type(() => AgentPermissionDto)
  permissions?: AgentPermissionDto[];
}
