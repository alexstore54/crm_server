import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import { BadRequestException } from '@nestjs/common';
import { ERROR_MESSAGES } from '@/shared/constants/errors';

export function IsOnePropertyRequired(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isOnePropertyRequired',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const dto = args.object as any;
          const keys = Object.keys(dto);
          for (const key of keys) {
            if (dto[key] !== null && dto[key] !== undefined && dto[key] !== '') {
              return true;
            }
          }
          throw new BadRequestException(ERROR_MESSAGES.ONE_FIELD_REQUIRED);
        },
      },
    });
  };
}
