import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AuthAgentController } from '@/modules/auth/controllers/auth-agent.controller';
import { AuthAgentService } from '@/modules/auth/services/auth-agent.service';
import { AuthService } from '@/modules/auth/services/auth.service';
import { ENDPOINTS, RESPONSE_STATUS, COOKIES } from '@/shared/constants/endpoints';

describe(AuthAgentController.name, () => {
  let app: INestApplication;
  let authAgentService: AuthAgentService;
  let authService: AuthService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AuthAgentController],
      providers: [
        {
          provide: AuthAgentService,
          useValue: {
            validate: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: AuthService,
          useValue: {
            authenticateAgent: jest.fn().mockResolvedValue({
              accessToken: 'accessToken',
              refreshToken: 'refreshToken',
            }),
            refreshTokens: jest.fn().mockResolvedValue({
              accessToken: 'accessToken',
              refreshToken: 'refreshToken',
            }),
            logout: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    authAgentService = moduleFixture.get<AuthAgentService>(AuthAgentService);
    authService = moduleFixture.get<AuthService>(AuthService);
  });

  it('should sign in successfully', () => {
    return request(app.getHttpServer())
      .post(ENDPOINTS.AUTH_AGENT.BASE + ENDPOINTS.AUTH_AGENT.SIGN_IN)
      .send({ username: 'test', password: 'test' })
      .set('user-agent', 'test-agent')
      .set('fingerprint', 'test-fingerprint')
      .expect(200)
      .expect(RESPONSE_STATUS.SUCCESS);
  });

  it('should refresh tokens successfully', () => {
    return request(app.getHttpServer())
      .post(ENDPOINTS.AUTH_AGENT.BASE + ENDPOINTS.AUTH_AGENT.REFRESH)
      .set('Cookie', [`${COOKIES.REFRESH_TOKEN}=refreshToken`])
      .expect(200)
      .expect(RESPONSE_STATUS.SUCCESS);
  });

  it('should logout successfully', () => {
    return request(app.getHttpServer())
      .post(ENDPOINTS.AUTH_AGENT.BASE + ENDPOINTS.AUTH_AGENT.LOGOUT)
      .set('Cookie', [`${COOKIES.REFRESH_TOKEN}=refreshToken`])
      .expect(200)
      .expect(RESPONSE_STATUS.SUCCESS);
  });

  afterAll(async () => {
    await app.close();
  });
});