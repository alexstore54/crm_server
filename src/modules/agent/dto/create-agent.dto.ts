import { IsEmail, IsNumber, IsOptional } from 'class-validator';
import { UseValidation } from '@/common/decorators/validation';
import { IncomingPermission } from '@/modules/permissions/dto';

export class CreateAgent {
  @IsNumber()
  roleId: number;

  @IsOptional()
  @IsEmail()
  email: string;

  @UseValidation.validatePassword()
  password: string;

  @IsOptional()
  @UseValidation.validateDesksIdArray()
  deskIds?: number[];

  @IsOptional()
  @UseValidation.validatePermissionsArray()
  permissions?: IncomingPermission[];
}
