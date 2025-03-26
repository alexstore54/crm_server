import { LeadRepository } from '@/modules/user/repositories';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Agent, Desk, Lead, Prisma, Role, Team } from '@prisma/client';
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
import { MediaImagesService } from '@/modules/media/services/media-images.service';
import { MediaDir, UpdateMediaParams } from '@/shared/types/media';
import { getMockedRole } from '@/shared/mocks/role/role.mock';

@Injectable()
export class AgentService {
  constructor(
    private readonly leadRepository: LeadRepository,
    private readonly agentRepository: AgentRepository,
    private readonly teamRepository: TeamRepository,
    private readonly deskRepository: DeskRepository,
    private readonly agentPermissionsService: AgentPermissionsService,
    private readonly prisma: PrismaService,
    private readonly mediaService: MediaImagesService,
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

  public async createAgent(data: CreateAgent, file?: Express.Multer.File): Promise<FullAgent> {
    const { permissions, deskIds } = data;

    const isExistAgent = await this.agentRepository.findOneByEmail(data.email);
    if (isExistAgent) {
      throw new BadRequestException(`${ERROR_MESSAGES.USER_EXISTS}`);
    }
    let avatarURL: string | null = null;

    try {
      const result = await this.prisma.$transaction(async (tx) => {
        const desks: Desk[] | null = await this.txGetDesksByIds(deskIds, tx);

        const newAgent: Agent = await this.agentRepository.txCreateOne(
          {
            input: data,
            desks,
          },
          tx,
        );

        const prismaPermissions = await this.agentPermissionsService.txCreateMany(
          {
            agentId: newAgent.id,
            permissions,
          },
          tx,
        );

        if (file) {
          avatarURL = this.mediaService.setOperationImage({
            name: 'avatar',
            file,
            publicId: newAgent.publicId,
            dir: MediaDir.AGENTS,
          });
        }
      });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}` + error.message);
    }
  }

  public async getOneFullByPublicId(publicId: string): Promise<FullAgent> {
    try {
      const result = await this.prisma.$transaction(async (tx) => {
        const agent: Agent | null = await this.fetchAgentByPublicId(publicId, tx);
        if (!agent) {
          throw new NotFoundException(ERROR_MESSAGES.AGENT_NOT_FOUND);
        }
        const desks: Desk[] = await this.fetchDesksByAgentId(agent.id, tx);
        const teams: Team[] = await this.fetchTeamsByAgentId(agent.id, tx);
        let role: Role | null = await this.fetchRoleByAgentId(agent.id, tx);

        if(!role) {
          //#TODO implement unassign role
          role = getMockedRole();
        }

        return { agent, desks, teams, role };
      });

      const { agent, desks, teams, role } = result;
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

  public async updateByPublicId(
    publicId: string,
    data: UpdateAgent,
    updateMedia: UpdateMediaParams,
  ) {
    const { deskIds, ...rest } = data;
    const { file, isAvatarRemoved } = updateMedia;

    const currentAgent = await this.agentRepository.findOneByPublicIdWithDesks(publicId);
    if (!currentAgent) {
      throw new NotFoundException(`${ERROR_MESSAGES.USER_IS_NOT_EXISTS}`);
    }

    const operatedFile = isAvatarRemoved ? null : file;

    const avatarURL = this.mediaService.setOperationImage({
      name: 'avatar',
      file: operatedFile,
      publicId: currentAgent.publicId,
      dir: MediaDir.AGENTS,
    });

    try {
      const result = await this.prisma.$transaction(async (tx) => {
        const newDeskIds = deskIds ? await this.getValidDeskIds(deskIds, currentAgent, tx) : null;
        return await this.agentRepository.txUpdateOne(
          currentAgent.id,
          { ...rest },
          tx,
          newDeskIds,
          avatarURL,
        );
      });
      if (result.avatarURL) {
        if (avatarURL === null) {
          await this.mediaService.removeImage();
        } else if (avatarURL) {
          await this.mediaService.saveImage();
        }
      }
      return result;
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

  private async fetchRoleByAgentId(agentId: number, tx: Prisma.TransactionClient) {
    return this.agentRepository.txFindRoleByAgentId(agentId, tx);
  }

  private async fetchTeamsByAgentId(
    agentId: number,
    tx: Prisma.TransactionClient,
  ): Promise<Team[]> {
    return this.teamRepository.txFindManyByAgentId(agentId, tx);
  }

  private async txGetDesksByIds(
    deskIds: number[] | undefined,
    tx: Prisma.TransactionClient,
  ): Promise<Desk[] | null> {
    return deskIds && deskIds.length > 0 ? this.deskRepository.txFindManyByIds(deskIds, tx) : null;
  }
}
