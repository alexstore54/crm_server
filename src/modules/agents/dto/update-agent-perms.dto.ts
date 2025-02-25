import { IsArray, IsNumber, IsOptional, ValidateIf, ValidateNested } from 'class-validator';
import { AgentPermissionDto } from './create-agent.dto';
import { Type } from 'class-transformer';

export class UpdateAgentPerms {
  @IsOptional()
  @IsNumber()
  roleId?: number;

  @IsOptional()
  @ValidateIf((o) => o.permissions !== null)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AgentPermissionDto)
  permissions?: AgentPermissionDto[];
}
