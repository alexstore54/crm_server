import { PrismaService } from "@/shared/db/prisma";
import { Injectable } from "@nestjs/common";
import { Prisma, RolePermission } from "@prisma/client";
import { AgentPermissionDto } from "../dto";

@Injectable()
export class RolePermissionRepository {
    constructor(private readonly prisma: PrismaService) {}

    async getRolePermissionsByRoleId(roleId: number) {
        return this.prisma.rolePermission.findMany({
            where: {
                roleId,
            },
        });
    }

    async getRolePermissionsByRoleIdWithTx(roleId: number, tx: Prisma.TransactionClient):Promise<RolePermission[]> {
        return tx.rolePermission.findMany({
            where: {
                roleId,
            },
        });
    }

    async getRolePermissionsByRoleIdAndPermsIdsWithTx(roleId: number, permissions: AgentPermissionDto[], tx: Prisma.TransactionClient):Promise<RolePermission[]> {
        return tx.rolePermission.findMany({
            where: {
                roleId,
                permissionId: {
                    in: permissions.map(p => p.permissionId),
                },
            },
        });
    }

    // async createRolePermission(data: any) { 
    //     try{
    //         return this.prisma.rolePermission.createMany({
    //             data,
    //         });
    //     }catch(error:any) {
    //         throw new Error(error.message);
    //     }
    //}

}