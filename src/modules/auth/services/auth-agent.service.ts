import { Injectable } from '@nestjs/common';
import { SignInAgent } from '@/modules/auth/dto/agent/sign-in.dto';
import { Agent } from '@prisma/client';
import { AgentRepository } from '@/modules/agents/repositories/agent.repository';

@Injectable()
export class AuthAgentService {
  constructor(private readonly agentRepository: AgentRepository) {}

  public async getProfile() {
    return 'Agent Profile';
  }

  public async getProfileById() {
    return 'Agent Profile';
  }

  public async signIn(data: SignInAgent): Promise<Agent | null> {
    const { email, password } = data;

    const agent = {};
    if (!agent) {
    }
  }
}