import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from '../auth.module';

describe(AuthModule.name, () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });
});
