import { Agent } from '@prisma/client';
import { AgentForClient } from '@/shared/types/agent';

export class AgentUtil {
  public static mapAgentToAgentForClient(agent: Agent): AgentForClient {
    const { password, ...agentWithoutPassword } = agent;
    return agentWithoutPassword;
  }
}
