import { Injectable } from '@nestjs/common';
import { AssignShift } from '@/modules/desk/dto/shifts/assign-shift.dto';
import { AgentForClient } from '@/shared/types/agent';
import { DeskAdminRepository } from '@/modules/desk/repositories';
import { Agent } from '@prisma/client';
import { AgentUtil } from '@/shared/utils';
import { UnassignShift } from '@/modules/desk/dto/shifts/unassign-shift.dto';

@Injectable()
export class ShiftService {
  constructor(public readonly deskAdminRepository: DeskAdminRepository) {}

  public async assign(publicId: string, data: AssignShift): Promise<AgentForClient[]> {
    const agents: Agent[] = await this.deskAdminRepository.assign(publicId, data);
    if (agents.length > 0) {
      return this.mapToClient(agents);
    }
    return [];
  }

  public async unassign(publicId: string, data: UnassignShift): Promise<AgentForClient[]> {
    const agents: Agent[] = await this.deskAdminRepository.unassign(publicId, data);
    if (agents.length > 0) {
      return this.mapToClient(agents);
    }
    return [];
  }

  public async getAll(deskPublicId: string): Promise<AgentForClient[]> {
    const agents: Agent[] = await this.deskAdminRepository.getAllByDeskPublicId(deskPublicId);
    if (agents.length > 0) {
      return this.mapToClient(agents);
    }
    return [];
  }

  private mapToClient = (agents: Agent[]) => {
    return agents.map((agent: Agent) => {
      return AgentUtil.mapAgentToAgentForClient(agent);
    });
  };
}
