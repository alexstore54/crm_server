import { AgentAuthPayload, CustomerAuthPayload } from '@/shared/types/auth';
import {
  agentAuthPayloadSchema,
  customerAuthPayloadSchema,
} from '@/shared/schemas/auth-payload.schema';
import { UnauthorizedException } from '@nestjs/common';
import { ERROR_MESSAGES } from '@/shared/constants/errors';

export class AuthUtil {
  public static validateCustomerAuthPayload(payload: CustomerAuthPayload): void {
    const { error } = customerAuthPayloadSchema.validate(payload);
    if (error) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_TOKEN);
    }
  }

  public static validateAgentAuthPayload(payload: AgentAuthPayload): void {
    const { error } = agentAuthPayloadSchema.validate(payload);
    if (error) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_TOKEN);
    }
  }
}
