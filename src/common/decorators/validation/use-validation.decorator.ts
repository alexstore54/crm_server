import {
  IsArray,
  IsNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { VALIDATION_REGEX } from '@/shared/constants/auth';
import { VALIDATION_ERRORS } from '@/shared/constants/errors';
import { Type } from 'class-transformer';
import { applyDecorators } from '@nestjs/common';
import { IncomingPermission } from '@/modules/permissions/dto';

export class UseValidation {
  public static validateName() {
    return applyDecorators(
      IsString(),
      Matches(VALIDATION_REGEX.NAME, { message: VALIDATION_ERRORS.NAME }),
      MaxLength(25),
    );
  }

  public static validatePassword() {
    return applyDecorators(
      IsString(),
      MinLength(8),
      MaxLength(20),
      Matches(VALIDATION_REGEX.PASSWORD, {
        message: VALIDATION_ERRORS.PASSWORD,
      }),
    );
  }

  public static validateDesksIdArray() {
    return applyDecorators(
      ValidateIf((o) => o.deskIds !== null),
      IsArray(),
      Type(() => Number),
      IsNumber({}, { each: true }),
    );
  }

  public static validatePermissionsArray() {
    return applyDecorators(
      ValidateIf((o) => o.permissions !== null),
      IsArray(),
      ValidateNested({ each: true }),
      Type(() => IncomingPermission),
    );
  }
}
