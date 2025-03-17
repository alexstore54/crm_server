import { ArgumentsHost, InternalServerErrorException } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppExceptionFilter } from './app-exception.filter';
import { AppLoggerService } from '@/modules/logger/services';
import { ConfigService } from '@nestjs/config';
import { LogLevel } from '@prisma/client';
import { configKeys } from '@/shared/schemas';
import { ACCEPTABLE_NODE_ENV } from '@/shared/constants/config';
import { FiltersUtil } from '@/shared/utils';

const mockStatus = 400;
const mockMessage = 'Test error';
// Now mockDetails corresponds to the string[] type
const mockDetails: string[] = ['errorDetail'];

describe('AppExceptionFilter', () => {
  let filter: AppExceptionFilter;
  let loggerService: Partial<AppLoggerService>;
  let configService: Partial<ConfigService>;
  let response: Partial<Response>;
  let request: Partial<Request>;
  let host: ArgumentsHost;

  /**
   * Creates a valid ExecutionContext for HTTP,
   * satisfying the HttpArgumentsHost interface (with methods getRequest, getResponse, getNext).
   */
  const createMockExecutionContext = (req: any): ArgumentsHost => {
    const mockHttp = {
      getRequest: () => req,
      getResponse: () => response,
      getNext: () => ({}), // added to satisfy the interface
    };
    return {
      switchToHttp: () => mockHttp,
    } as unknown as ArgumentsHost;
  };

  beforeEach(() => {
    loggerService = {
      error: jest.fn(),
    };

    configService = {
      get: jest.fn(),
    };

    request = {
      url: '/test-url',
      path: '/test-path',
    };

    response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    host = createMockExecutionContext(request);

    filter = new AppExceptionFilter(
      loggerService as AppLoggerService,
      configService as ConfigService,
    );

    // Mock FiltersUtil methods
    jest.spyOn(FiltersUtil, 'getExceptionStatus').mockReturnValue(mockStatus);
    jest.spyOn(FiltersUtil, 'getExceptionMessage').mockReturnValue(mockMessage);
    jest.spyOn(FiltersUtil, 'getExceptionDetails').mockReturnValue(mockDetails);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should return an error with details when NODE_ENV is acceptable', () => {
    // Suppose NODE_ENV is in ACCEPTABLE_NODE_ENV, e.g., 'development'
    (configService.get as jest.Mock).mockReturnValue('development');

    const exception = new Error('Some error');

    filter.catch(exception, host);

    // Check that the logger was called with the correct parameters
    expect(loggerService.error).toHaveBeenCalledWith(mockMessage, {
      message: mockMessage,
      level: LogLevel.ERROR,
      context: { path: request.path },
    });

    // Check that the response contains status and JSON with details
    expect(response.status).toHaveBeenCalledWith(mockStatus);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: mockMessage,
        statusCode: mockStatus,
        path: request.url,
        details: mockDetails,
        timestamp: expect.any(String),
      }),
    );
  });

  it('Should return an error without details when NODE_ENV is not acceptable', () => {
    // Suppose NODE_ENV is not in ACCEPTABLE_NODE_ENV, e.g., 'production'
    (configService.get as jest.Mock).mockReturnValue('production');

    const exception = new Error('Some error');

    filter.catch(exception, host);

    // Check logger call
    expect(loggerService.error).toHaveBeenCalledWith(mockMessage, {
      message: mockMessage,
      level: LogLevel.ERROR,
      context: { path: request.path },
    });

    // Check that details are missing in the response (undefined)
    expect(response.status).toHaveBeenCalledWith(mockStatus);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: mockMessage,
        statusCode: mockStatus,
        path: request.url,
        details: undefined,
        timestamp: expect.any(String),
      }),
    );
  });
});
