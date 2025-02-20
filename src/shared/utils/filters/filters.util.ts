import { HttpException, HttpStatus } from '@nestjs/common';
import { ERROR_MESSAGES } from '@/shared/constants/errors';

export class FiltersUtil {
  public static getExceptionStatus(exception: unknown): number {
    return exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
  }

  public static getExceptionMessage(exception: unknown, message?: string): string {
    if (exception instanceof HttpException) {
      return exception.message;
    }
    return message ?? ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
  }

  public static getExceptionDetails(exception: any): string[] | undefined {
    if (!(exception instanceof HttpException)) {
      return undefined;
    }
    const response = exception.getResponse() as { message?: string | string[] };

    if (!response || typeof response !== 'object') {
      return undefined;
    }
    if (Array.isArray(response.message)) {
      return response.message;
    }
    return undefined;
  }
}
