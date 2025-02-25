import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AgentAccessGuard, ModeratorGuard } from '@/common/guards/tokens/agent';
import { RequestWithAgentPayload } from '@/shared/types/auth';
import { AgentService } from '../services/agent.service';
import { CreateAgent, UpdateAgent } from '../dto';

// import { CreateLeadCustomerDto } from '../dto/create-lead-customer.dto';

@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @UseGuards(AgentAccessGuard)
  @Get('leads')
  async getLeadsByAgentId(@Req() request: RequestWithAgentPayload) {
    const payload = request.user;

    return this.agentService.getLeadsByPublicId(payload.sub);
  }

  @UseGuards(AgentAccessGuard, ModeratorGuard)
  @Post('create')
  async createAgent(@Body() body: CreateAgent, @Req() request: RequestWithAgentPayload) {
    return this.agentService.createAgent(body);
  }

  @UseGuards(AgentAccessGuard, ModeratorGuard)
  @Patch('update/:publicId')
  async updateAgent(@Param('publicId') publicId: string, @Body() body: UpdateAgent) {
    return this.agentService.updateAgentByPublicId(publicId, body);
  }

  // @UseGuards(AgentAccessGuard, ModeratorGuard)
  // @Post('leads/create')
  // async createLead(
  //     @Body() body: CreateLeadCustomerDto ,
  //     @Req()  request: RequestWithAgentPayload,
  //     @Res()  response: Response
  // ) {

  //     return this.agentService.createLeadWithCustomerByAgent(body);
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
