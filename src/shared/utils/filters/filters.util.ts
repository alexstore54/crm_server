import { HttpException, HttpStatus } from '@nestjs/common';
import { ERROR_MESSAGES } from '@/shared/constants/errors';

export class FiltersUtil {
  static getExceptionStatus(exception: unknown): number {
    return exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
  }

  static getExceptionMessage(exception: unknown, message?: string): string {
    if (exception instanceof HttpException) {
      return exception.message;
    }
    return message ?? ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
  }
}
