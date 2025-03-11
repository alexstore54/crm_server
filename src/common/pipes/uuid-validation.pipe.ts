import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { validate as isUUID } from 'uuid';
import { VALIDATION_ERRORS } from '@/shared/constants/errors';

@Injectable()
export class UUIDValidationPipe implements PipeTransform<string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    if (!isUUID(value)) {
      throw new BadRequestException(`${VALIDATION_ERRORS.INVALID_UUID}: ${value}`);
    }
    return value;
  }
}
