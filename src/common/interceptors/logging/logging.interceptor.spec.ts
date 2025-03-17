import { Test, TestingModule } from '@nestjs/testing';
import { of, lastValueFrom } from 'rxjs';
import { ExecutionContext, InternalServerErrorException } from '@nestjs/common';
import { AppLoggingInterceptor } from './logging.interceptor';
import { AppLoggerService } from '@/modules/logger/services';
import { PrismaService } from '@/shared/db/prisma';
import { LogLevel, LogUserType } from '@prisma/client';
import { AgentAuthPayload, CustomerAuthPayload } from '@/shared/types/auth';
import { ERROR_MESSAGES } from '@/shared/constants/errors';

describe('AppLoggingInterceptor', () => {
  let interceptor: AppLoggingInterceptor;
  let loggerService: AppLoggerService;
  let prismaService: PrismaService;

  /**
   * Creates a valid ExecutionContext for HTTP,
   * satisfying the HttpArgumentsHost interface.
   */
  const createMockExecutionContext = (req: any): ExecutionContext => {
    const mockHttp = {
      getRequest: () => req,
      getResponse: () => ({}),
      getNext: () => ({}),
    };
    return {
      switchToHttp: () => mockHttp,
    } as unknown as ExecutionContext;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppLoggingInterceptor,
        {
          provide: AppLoggerService,
          useValue: {
            log: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            customer: {
              findFirst: jest.fn(),
            },
            agent: {
              findFirst: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    interceptor = module.get<AppLoggingInterceptor>(AppLoggingInterceptor);
    loggerService = module.get<AppLoggerService>(AppLoggerService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  it('Must call logger without user in the request', async () => {
    const mockRequest = {
      method: 'GET',
      url: '/test',
      user: undefined,
    };

    const ctx = createMockExecutionContext(mockRequest);
    const next = { handle: () => of('test-response') };

    const observable$ = await interceptor.intercept(ctx, next);
    await lastValueFrom(observable$);

    expect(loggerService.log).toHaveBeenCalledWith(
      expect.stringContaining('Request to GET /test took'),
      expect.objectContaining({
        context: { path: '/test' },
        level: LogLevel.INFO,
        userId: undefined,
        logUserType: undefined,
      })
    );
  });

  it('Must define user as CUSTOMER and find it in the database', async () => {
     // Use sub value as publicId
    (prismaService.customer.findFirst as jest.Mock).mockResolvedValue({ id: 123 });

    const mockUser: CustomerAuthPayload = {
      payloadUUID: "0b724a1f-0188-4912-a5f1-613806b4cb83",
      sub: "8a8049e9-6406-405f-b712-6b145c470a09"
    };

    const mockRequest = {
      method: 'POST',
      url: '/customer',
      user: mockUser,
    };

    const ctx = createMockExecutionContext(mockRequest);
    const next = { handle: () => of('test-response') };

    const observable$ = await interceptor.intercept(ctx, next);
    await lastValueFrom(observable$);

    expect(prismaService.customer.findFirst).toHaveBeenCalledWith({
      where: { publicId: mockUser.sub },
      select: { id: true },
    });

    expect(loggerService.log).toHaveBeenCalledWith(
      expect.stringContaining('Request to POST /customer took'),
      expect.objectContaining({
        userId: 123,
        logUserType: LogUserType.CUSTOMER,
      })
    );
  });

  it('Must define the user as AGENT and find it in the database', async () => {
    // Update mock to return { id: 456 }
    (prismaService.agent.findFirst as jest.Mock).mockResolvedValue({ id: 456 });

    const mockUser: AgentAuthPayload = {
      teamsPublicId: ["team-uuid-1", "team-uuid-2"],
      desksPublicId: ["desk-uuid-1", "desk-uuid-2"],
      payloadUUID: "some-payload-uuid",
      sub: "0b724a1f-0188-4912-a5f1-613806b4cb83"
    };

    const mockRequest = {
      method: 'PUT',
      url: '/agent',
      user: mockUser,
    };

    const ctx = createMockExecutionContext(mockRequest);
    const next = { handle: () => of('test-response') };

    const observable$ = await interceptor.intercept(ctx, next);
    await lastValueFrom(observable$);

    expect(prismaService.agent.findFirst).toHaveBeenCalledWith({
      where: { publicId: mockUser.sub },
      select: { id: true },
    });

    expect(loggerService.log).toHaveBeenCalledWith(
      expect.stringContaining('Request to PUT /agent took'),
      expect.objectContaining({
        userId: 456,
        logUserType: LogUserType.AGENT,
      })
    );
  });

  it('Should return an InternalServerErrorException error when a database failure occurs', async () => {
    (prismaService.customer.findFirst as jest.Mock).mockRejectedValue(new Error('DB is down'));

    const mockUser: CustomerAuthPayload = {
      payloadUUID: "0b724a1f-0188-4912-a5f1-613806b4cb83",
      sub: "8a8049e9-6406-405f-b712-6b145c470a09"
    };

    const mockRequest = {
      method: 'GET',
      url: '/error-test',
      user: mockUser,
    };

    const ctx = createMockExecutionContext(mockRequest);
    const next = { handle: () => of('some-response') };

    try {
      const observable$ = await interceptor.intercept(ctx, next);
      await lastValueFrom(observable$);
      fail('Expected an error to be thrown, but Observable completed successfully');
    } catch (err: any) {
      expect(err).toBeInstanceOf(InternalServerErrorException);
      expect(err.message).toContain(ERROR_MESSAGES.DB_ERROR);
      expect(err.getStatus()).toBe(500);
    }
  });

  it('Must use the cache on a repeat request', async () => {
    (prismaService.customer.findFirst as jest.Mock).mockResolvedValue({ id: 999 });

    const mockUser: CustomerAuthPayload = {
      payloadUUID: "0b724a1f-0188-4912-a5f1-613806b4cb83",
      sub: "8a8049e9-6406-405f-b712-6b145c470a09"
    };

    const mockRequest = {
      method: 'GET',
      url: '/cache-test',
      user: mockUser,
    };

    const ctx = createMockExecutionContext(mockRequest);
    const next = { handle: () => of(null) };

    const firstObs$ = await interceptor.intercept(ctx, next);
    await lastValueFrom(firstObs$);
    expect(prismaService.customer.findFirst).toHaveBeenCalledTimes(1);

    (prismaService.customer.findFirst as jest.Mock).mockClear();

    const secondObs$ = await interceptor.intercept(ctx, next);
    await lastValueFrom(secondObs$);
    expect(prismaService.customer.findFirst).toHaveBeenCalledTimes(0);
  });
});
