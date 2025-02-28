import { IsEmail, IsNumber, IsOptional } from 'class-validator';
import { IncomingPermission } from '@/modules/permissions/dto/agent-permissions';
import { UserValidation } from '@/common/decorators/validation';

export class CreateAgent {
  @IsNumber()
  roleId: number;

  @IsOptional()
  @IsEmail()
  email: string;

  @UserValidation.validatePassword()
  password: string;

  @IsOptional()
  @UserValidation.validateDesksIdArray()
  deskIds?: number[];

  @IsOptional()
  @UserValidation.validatePermissionsArray()
  permissions?: IncomingPermission[];
}
