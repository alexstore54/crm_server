

import { PrismaService } from "@/shared/db/prisma";
import { CreateAgent, UpdateAgent } from "@/shared/types/agent";
import { Injectable } from "@nestjs/common";
import { Agent } from "@prisma/client";


@Injectable()
export class LeadsRepository {
    constructor(private readonly prisma: PrismaService) {}

    async getAll():Promise<Agent[]> {
        return this.prisma.agent.findMany();
    }

    async getById(id: number):Promise<Agent | null> {
        return this.prisma.agent.findFirst({where: {id}})
    }
    async getByUUID(public_id: string):Promise<Agent | null> {
        return this.prisma.agent.findFirst({where: {public_id}})
    }

    async create(data: CreateAgent):Promise<Agent> {
        const { desk_ids, role_id, ...rest } = data;
        return this.prisma.agent.create({
          data: {
            ...rest,
            // Если role_id указан, обновляем связь с Role через nested connect:
            ...(role_id ? { role: { connect: { id: role_id } } } : {}),
            // Если указан список идентификаторов desk, привязываем их через nested connect:
            ...(desk_ids ? { desks: { connect: desk_ids.map(id => ({ id })) } } : {}),
          },
        });
    }

    async deleteById(id: number):Promise<Agent | null> {
        return this.prisma.agent.delete({where: {id}});
    }

    async deleteByUUID(public_id: string):Promise<Agent | null> {
        return this.prisma.agent.delete({where: {public_id}});
    }

    async updateById(id: number, data: UpdateAgent):Promise<Agent | null> {
        
        const { desk_ids, role_id, ...rest } = data;
        return this.prisma.agent.update({
            where: { id },
            data: {
            ...rest,
            ...(role_id !== undefined ? { role: { connect: { id: role_id } } } : {}),
            // Операция set очищает предыдущие связи и устанавливает новые,
            // если хотите добавлять/удалять по-отдельности, используйте connect/disconnect
            ...(desk_ids ? { desks: { set: desk_ids.map(id => ({ id })) } } : {}),
            },
        });
    }

    async updateByUUID(public_id: string, data: UpdateAgent):Promise<Agent | null> {
        const { desk_ids, role_id, ...rest } = data;
        return this.prisma.agent.update({
            where: { public_id },
            data: {
            ...rest,
            ...(role_id !== undefined ? { role: { connect: { id: role_id } } } : {}),
            // Операция set очищает предыдущие связи и устанавливает новые,
            // если хотите добавлять/удалять по-отдельности, используйте connect/disconnect
            ...(desk_ids ? { desks: { set: desk_ids.map(id => ({ id })) } } : {}),
            },
        });
    }
}