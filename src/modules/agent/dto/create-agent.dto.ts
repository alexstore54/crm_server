import { IsEmail, IsNumber, IsOptional } from 'class-validator';
import { UseValidation } from '@/common/decorators/validation';
import { IncomingPermission } from '@/modules/permissions/dto';

export class CreateAgent {
  @IsNumber()
  @IsOptional()
  roleId: number;

  @IsEmail()
  email: string;

  @UseValidation.validatePassword()
  password: string;

  @IsOptional()
  @UseValidation.validateNumberArray()
  deskIds?: number[];

  @IsOptional()
  @UseValidation.validateNumberArray()
  teamsIds?: number[];


  @UseValidation.validatePermissionsArray()
  permissions: IncomingPermission[];
}
