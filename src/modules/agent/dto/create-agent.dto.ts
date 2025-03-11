import { IsEmail, IsNumber, IsOptional } from 'class-validator';
import { IncomingPermission } from '@/modules/permissions/dto/agent-permissions';
import { UseValidator } from '@/common/decorators/validation';

export class CreateAgent {
  @IsNumber()
  roleId: number;

  @IsOptional()
  @IsEmail()
  email: string;

  @UseValidator.validatePassword()
  password: string;

  @IsOptional()
  @UseValidator.validateDesksIdArray()
  deskIds?: number[];

  @IsOptional()
  @UseValidator.validatePermissionsArray()
  permissions?: IncomingPermission[];
}
