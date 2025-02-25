import { BadRequestException, Injectable } from '@nestjs/common';
import { SignInAgent } from '@/modules/auth/dto/agent/sign-in.dto';
import { Agent } from '@prisma/client';
import { AgentRepository } from '@/modules/agent/repositories/agent.repository';
import { ERROR_MESSAGES } from '@/shared/constants/errors';
import { BcryptHelper } from '@/shared/helpers';

@Injectable()
export class AuthAgentService {
  constructor(private readonly agentRepository: AgentRepository) {}

  public async validate(data: SignInAgent): Promise<Agent> {
    const { email, password } = data;

    const agent = await this.agentRepository.findOneByEmail(email);
    if (!agent) {
      throw new BadRequestException(ERROR_MESSAGES.INVALID_CREDS);
    }

    const isPasswordMatch = await BcryptHelper.compare(password, agent.password);
    if (!isPasswordMatch) {
      throw new BadRequestException(ERROR_MESSAGES.INVALID_CREDS);
    }

    return agent;
  }
}
