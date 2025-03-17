import { AuthUtil } from './auth.util';
import { UnauthorizedException } from '@nestjs/common';
import { ERROR_MESSAGES } from '@/shared/constants/errors';
import { agentAuthPayloadSchema, customerAuthPayloadSchema } from '@/shared/schemas';
import { getMockedAgentAuthPayload, getMockedCustomerAuthPayload } from '@/shared/mocks/auth';

jest.mock('@/shared/schemas', () => ({
  agentAuthPayloadSchema: {
    validate: jest.fn(),
  },
  customerAuthPayloadSchema: {
    validate: jest.fn(),
  },
}));

describe(AuthUtil.name, () => {
  describe(AuthUtil.validateCustomerAuthPayload.name, () => {
    it('should throw UnauthorizedException for invalid customer payload', () => {
      (customerAuthPayloadSchema.validate as jest.Mock).mockReturnValue({
        error: new Error('Invalid payload'),
      });

      expect(() =>
        AuthUtil.validateCustomerAuthPayload(getMockedCustomerAuthPayload()),
      ).toThrowError(new UnauthorizedException(ERROR_MESSAGES.INVALID_TOKEN));
    });

    it('should not throw for valid customer payload', () => {
      (customerAuthPayloadSchema.validate as jest.Mock).mockReturnValue({ error: null });

      expect(() =>
        AuthUtil.validateCustomerAuthPayload(getMockedCustomerAuthPayload()),
      ).not.toThrow();
    });
  });

  describe(AuthUtil.validateAgentAuthPayload.name, () => {
    it('should throw UnauthorizedException for invalid agent payload', () => {
      (agentAuthPayloadSchema.validate as jest.Mock).mockReturnValue({
        error: new Error('Invalid payload'),
      });

      expect(() => AuthUtil.validateAgentAuthPayload(getMockedAgentAuthPayload())).toThrowError(
        new UnauthorizedException(ERROR_MESSAGES.INVALID_TOKEN),
      );
    });

    it('should not throw for valid agent payload', () => {
      (agentAuthPayloadSchema.validate as jest.Mock).mockReturnValue({ error: null });

      expect(() => AuthUtil.validateAgentAuthPayload(getMockedAgentAuthPayload())).not.toThrow();
    });
  });
});
