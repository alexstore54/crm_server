import { Body, Controller, Get, Param, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AgentAccessGuard, ModeratorGuard } from '@/common/guards/tokens/agent';
import { RequestWithAgentPayload } from '@/shared/types/auth';
import { AgentService } from '../services/agent.service';
import { Response } from 'express';
import { CreateAgent, UpdateAgent } from '../dto';
import { UpdateAgentPerms } from '../dto/update-agent-perms.dto';
// import { CreateLeadCustomerDto } from '../dto/create-lead-customer.dto';

@Controller('agent')
export class AgentController {
    constructor(private readonly agentSerive: AgentService){}

    @UseGuards(AgentAccessGuard)
    @Get('leads')
    async getLeadsByAgentId(
        @Req() request: RequestWithAgentPayload,
    ) {
        const payload = request.user;
        
        return this.agentSerive.getLeadsByAgentId(payload.sub);   
    }

    @UseGuards(AgentAccessGuard, ModeratorGuard)
    @Post('create')    
    async createAgent(
        @Body() body: CreateAgent,
        @Req()  request: RequestWithAgentPayload,
       
    ) {
        return this.agentSerive.createAgent(body);
    }

    @UseGuards(AgentAccessGuard, ModeratorGuard)
    @Patch('update/:publicId')
    async updateAgent(
        @Param('publicId') publicId: string,   
        @Body() body: UpdateAgent,
    ){
        return this.agentSerive.updateAgentByPublicId(publicId, body);
    }

    @UseGuards(AgentAccessGuard, ModeratorGuard)
    @Patch(':publicId/permissions/update')
    async updateAgentPermissions(
        @Param('publicId') publicId: string,
        @Body() body: UpdateAgentPerms
    ){
        return this.agentSerive.updateAgentPermissionsByPublicId(publicId, body);
    }
    
    // @UseGuards(AgentAccessGuard, ModeratorGuard)
    // @Post('leads/create')    
    // async createLead(
    //     @Body() body: CreateLeadCustomerDto ,
    //     @Req()  request: RequestWithAgentPayload,
    //     @Res()  response: Response
    // ) {

    //     return this.agentSerive.createLeadWithCustomerByAgent(body);
    // }



    // @UseGuards(AgentAccessGuard)
    // @Post('leads/create')
    // async createLead(
    //     @Req() request: RequestWithAgentPayload
    // ) {
    //     const payload = request.user;
         
    // }

    // @UseGuards(AgentAccessGuard)
    // @Post('leads/create')
    // async createLead(
    //     @Req() request: RequestWithAgentPayload
    // ) {
    //     const payload = request.user;
        
      
    // }

}
