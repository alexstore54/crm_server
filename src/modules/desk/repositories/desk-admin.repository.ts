import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AssignShift } from '@/modules/desk/dto/shifts/assign-shift.dto';
import { Agent, DeskAdmin } from '@prisma/client';
import { PrismaService } from '@/shared/db/prisma';
import { ERROR_MESSAGES } from '@/shared/constants/errors';

@Injectable()
export class DeskAdminRepository {
  constructor(private readonly prisma: PrismaService) {}

  private async getDeskByPublicId(tx: any, deskPublicId: string) {
    const desk = await tx.desk.findUnique({
      where: { publicId: deskPublicId },
    });

    if (!desk) {
      throw new NotFoundException();
    }

    return desk;
  }

  private async getAgentsByDeskId(tx: any, deskId: number): Promise<Agent[]> {
    const shifts: DeskAdmin[] = await tx.shift.findMany({
      where: { deskId },
      select: { agentId: true },
    });

    return tx.agent.findMany({
      where: {
        id: { in: shifts.map((shift) => shift.agentId) },
      },
    });
  }

  public async assign(deskPublicId: string, data: AssignShift): Promise<Agent[]> {
    const { agentId } = data;

    try {
      return this.prisma.$transaction(async (tx) => {
        const desk = await this.getDeskByPublicId(tx, deskPublicId);

        const existingShift = await tx.deskAdmin.findUnique({
          where: { agentId },
        });

        if (existingShift) {
          throw new BadRequestException(ERROR_MESSAGES.USER_EXISTS);
        }

        await tx.deskAdmin.create({
          data: {
            deskId: desk.id,
            agentId,
          },
        });

        return this.getAgentsByDeskId(tx, desk.id);
      });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async unassign(deskPublicId: string, data: AssignShift): Promise<Agent[]> {
    const { agentId } = data;

    try {
      return this.prisma.$transaction(async (tx) => {
        const desk = await this.getDeskByPublicId(tx, deskPublicId);

        await tx.deskAdmin.delete({
          where: {
            deskId: desk.id,
            agentId,
          },
        });

        return this.getAgentsByDeskId(tx, desk.id);
      });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }

  public async getAllByDeskPublicId(deskPublicId: string): Promise<Agent[]> {
    try {
      return this.prisma.$transaction(async (tx) => {
        const desk = await this.getDeskByPublicId(tx, deskPublicId);
        return this.getAgentsByDeskId(tx, desk.id);
      });
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }
}
