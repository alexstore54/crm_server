import { PrismaService } from "@/shared/db/prisma";
import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

@Injectable()
export class PermissionRepository {
    constructor (private readonly prisma: PrismaService){}

    public async findOneById(){}
    public async findOneByKey(){}
    public async findAll(){}
    public async txFindManyByIds(ids: number[], tx: Prisma.TransactionClient){
        return tx.permission.findMany({
                where: {id: {in: ids}}
        })
    }
    public async txFindManyByIdsExclude(ids: number[], tx: Prisma.TransactionClient) {
        return tx.permission.findMany({
            where: {id: { notIn: ids }}
        });
    }
    public async txFindAll(tx: Prisma.TransactionClient){
        return tx.permission.findMany({})
    }
}