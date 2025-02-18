import { PrismaService } from "@/shared/db/prisma";
import { Injectable } from "@nestjs/common";
import { Leads } from "@prisma/client";
import { CreateLeads, UpdateLeads } from "@/shared/types/user";

@Injectable()
export class LeadsRepository {
    constructor(private readonly prisma: PrismaService) {}

    async getAll():Promise<Leads[]> {
        return this.prisma.leads.findMany();
    }

    async getById(id: number):Promise<Leads | null> {
        return this.prisma.leads.findFirst({where: {id}})
    }

    async create(data: CreateLeads):Promise<Leads> {
        return this.prisma.leads.create({data});
    }

    async deleteById(id: number):Promise<Leads | null> {
        return this.prisma.leads.delete({where: {id}});
    }

    async updateById(id: number, data: UpdateLeads):Promise<Leads | null> {
        const {status_id, ...rest} = data;
        return this.prisma.leads.update({where: {id},  
            data: {
            ...rest,
            ...(status_id !== undefined ? { status: { connect: { id: status_id } } } : {})
          }});
    }
}