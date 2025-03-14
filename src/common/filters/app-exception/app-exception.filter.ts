import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { FiltersUtil } from '@/shared/utils';
import { AppError } from '@/shared/types/errors';
import { Request, Response } from 'express';
import { AppLoggerService } from '@/modules/logger/services';
import { LogLevel } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { configKeys } from '@/shared/schemas';
import { NodeEnv } from '@/common/config/types';
import { ACCEPTABLE_NODE_ENV } from '@/shared/constants/config';

export class AppExceptionFilter implements ExceptionFilter {
  constructor(
    private logger: AppLoggerService,
    private configService: ConfigService,
  ) {}

  catch(exception: any, host: ArgumentsHost) {
    //получем контекст запроса, ответа и запроса
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    //создаем статус ошибки, и сообщение
    const status = FiltersUtil.getExceptionStatus(exception);
    const message = FiltersUtil.getExceptionMessage(exception);

    //достаем детали ошибки, если у нас ошибка валидации

    const details = ACCEPTABLE_NODE_ENV.includes(
      this.configService.get(configKeys.NODE_ENV) as NodeEnv,
    )
      ? FiltersUtil.getExceptionDetails(exception)
      : undefined;

    this.logger.error(message, {
      message,
      level: LogLevel.ERROR,
      context: {
        path: request.path,
      },
    });

    //формируем ошибку
    const error: AppError = {
      message: FiltersUtil.getExceptionMessage(exception),
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      details,
    };

    response.status(status).json(error);
  }
}
