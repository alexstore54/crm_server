import { ERROR_MESSAGES } from "@/shared/constants/errors";
import { PrismaService } from "@/shared/db/prisma";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { AgentPerms } from "../types/agent-perms.type";

@Injectable()
export class AgentPermissionRepository {
    constructor(private readonly prisma: PrismaService) {}

    async getAgentPermissionsByAgentIdWithTx(agentId: number, tx: Prisma.TransactionClient) {
        try{
            return tx.agentPermission.findMany({
                where: {
                    agentId,
                },
            });

        }catch(error:any){
            throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
        }
        
    }

    async getAgentPermissionsByAgentId(agentId: number) {
        try{
            return this.prisma.agentPermission.findMany({
                where: {
                    agentId,
                },
            });
        }catch(error:any){
            throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
        }
    }

    async createManyWithTx(data: AgentPerms[], tx:Prisma.TransactionClient){
        try{
            return tx.agentPermission.createMany({data});
        }catch(error:any){
            throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
        }
    }

    async deleteManyByAgentIdAndPermsIdsWithTx(agentId: number, permissionIds: number[], tx: Prisma.TransactionClient){
        try{
            return tx.agentPermission.deleteMany({
                where: {
                    agentId,
                    permissionId: {in: permissionIds}
                },
            });
        }catch(error: any){
            throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
        }

    }

    async deleteManyByAgentIdWithTx(agentId: number, tx: Prisma.TransactionClient){
        try{
            return tx.agentPermission.deleteMany({
                where: {
                    agentId,
                },
            });
        }catch(error: any){
            throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
        }
    }

}