import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import  request from 'supertest';
import { ENDPOINTS, RESPONSE_STATUS } from '@/shared/constants/endpoints';
import { AuthController } from '@/modules/auth/controllers';

describe(AuthController.name, () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should return success for getCsrfToken', () => {
    return request(app.getHttpServer())
      .get(ENDPOINTS.AUTH.BASE + ENDPOINTS.AUTH.GET_CSRF_TOKEN)
      .expect(200)
  });

  afterAll(async () => {
    await app.close();
  });
});