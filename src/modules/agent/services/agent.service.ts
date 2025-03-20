import { LeadRepository } from '@/modules/user/repositories';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Agent, Desk, Lead, Prisma, Team } from '@prisma/client';
import { ERROR_MESSAGES } from '@/shared/constants/errors';
import { PrismaService } from '@/shared/db/prisma';
import { AgentRepository } from '@/modules/agent/repositories';
import { CreateAgent, UpdateAgent } from '@/modules/agent/dto';
import { AgentUtil, ArrayUtil, PermissionsUtil } from '@/shared/utils';
import { TeamRepository } from '@/modules/team/repositories/team.repository';
import { FullAgent } from '@/shared/types/agent';
import { AgentPermissionsService } from '@/modules/permissions/service';
import { PermissionsTable } from '@/shared/types/permissions';
import { DeskRepository } from '@/modules/desk/repositories';

@Injectable()
export class AgentService {
  constructor(
    private readonly leadRepository: LeadRepository,
    private readonly agentRepository: AgentRepository,
    private readonly teamRepository: TeamRepository,
    private readonly deskRepository: DeskRepository,
    private readonly agentPermissionsService: AgentPermissionsService,
    private readonly prisma: PrismaService,
  ) {}

  public async getLeadsByPublicId(publicId: string): Promise<Lead[]> {
    const agent = await this.agentRepository.findOneByPublicId(publicId);
    if (!agent) {
      throw new NotFoundException(ERROR_MESSAGES.AGENT_NOT_FOUND);
    }

    try {
      return await this.leadRepository.getLeadsByAgentId(agent.id);
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}` + error.message);
    }
  }

  public async createAgent(data: CreateAgent) {
    const { permissions, deskIds } = data;

    const isExistAgent = await this.agentRepository.findOneByEmail(data.email);
    if (isExistAgent) {
      throw new BadRequestException(`${ERROR_MESSAGES.USER_EXISTS}`);
    }

    try {
      const newAgent: Agent = await this.prisma.$transaction(async (tx) => {
        // Если deskIds переданы – получаем связанные записи, иначе оставляем null
        const desks = await this.getDesksByIds(deskIds, tx);

        // Создаем агента, передавая desks (если они есть, иначе null)
        return await this.agentRepository.txCreateOne(
          {
            input: data,
            desks,
          },
          tx,
        );
      });

      if (permissions && permissions.length > 0) {
        await this.prisma.$transaction(async (tx) => {
          await this.agentPermissionsService.createMany({
            agentId: newAgent.id,
            permissions,
          });
        });
      }

      return newAgent;
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}` + error.message);
    }
  }

  public async getOneFullByPublicId(publicId: string): Promise<FullAgent> {
    try {
      const result = await this.prisma.$transaction(async (tx) => {
        const agent: Agent = await this.fetchAgentByPublicId(publicId, tx);
        const desks: Desk[] = await this.fetchDesksByAgentId(agent.id, tx);
        const teams: Team[] = await this.fetchTeamsByAgentId(agent.id, tx);

        return { agent, desks, teams };
      });

      const { agent, desks, teams } = result;
      const clientAgent = AgentUtil.mapAgentToAgentForClient(agent);
      const permissionsTable = await this.fetchPermissionsTable(agent.id);
      return {
        agent: clientAgent,
        permissions: permissionsTable,
        desks,
        teams,
      };
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}` + error.message);
    }
  }

  public async updateByPublicId(publicId: string, data: UpdateAgent, file?: Express.Multer.File) {
    const { deskIds, ...rest } = data;

    const currentAgent = await this.agentRepository.findOneByPublicIdWithDesks(publicId);
    if (!currentAgent) {
      throw new NotFoundException(`${ERROR_MESSAGES.USER_IS_NOT_EXISTS}`);
    }

    try {
      return this.prisma.$transaction(async (tx) => {
        const newDeskIds = deskIds ? await this.getValidDeskIds(deskIds, currentAgent, tx) : null;
        return await this.agentRepository.txUpdateOne(currentAgent.id, { ...rest }, tx, newDeskIds);
      });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}` + error.message);
    }
  }

  public async getOneByPublicId(publicId: string) {
    try {
      return this.agentRepository.findOneByPublicIdWithDesks(publicId);
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}` + error.message);
    }
  }

  private async fetchAgentByPublicId(publicId: string, tx: Prisma.TransactionClient) {
    const agent = await this.agentRepository.txFindOneByPublicId(publicId, tx);
    if (!agent) {
      throw new NotFoundException(ERROR_MESSAGES.AGENT_NOT_FOUND);
    }
    return agent;
  }

  private async fetchPermissionsTable(agentId: number): Promise<PermissionsTable> {
    const agentPermissions =
      await this.agentPermissionsService.getManyWithDetailsByAgentId(agentId);

    return PermissionsUtil.mapPrismaPermissionsToPermissionTable(agentPermissions);
  }

  private async fetchDesksByAgentId(
    agentId: number,
    tx: Prisma.TransactionClient,
  ): Promise<Desk[]> {
    return this.deskRepository.txFindManyByAgentId(agentId, tx);
  }

  private async getValidDeskIds(
    deskIds: number[],
    currentAgent: Agent & { Desk: Desk[] },
    tx: Prisma.TransactionClient,
  ): Promise<number[] | null> {
    const validDesks = await this.deskRepository.txFindManyByIds(deskIds, tx);
    const validDeskIds = validDesks.map((desk) => desk.id);
    const currentDeskIds = currentAgent.Desk.map((desk) => desk.id);

    return !ArrayUtil.isArraysEqual(currentDeskIds, validDeskIds) ? validDeskIds : null;
  }

  private async fetchTeamsByAgentId(
    agentId: number,
    tx: Prisma.TransactionClient,
  ): Promise<Team[]> {
    return this.teamRepository.txFindManyByAgentId(agentId, tx);
  }

  private async getDesksByIds(deskIds: number[] | undefined, tx: Prisma.TransactionClient) {
    return deskIds && deskIds.length > 0 ? this.deskRepository.txFindManyByIds(deskIds, tx) : null;
  }
}
