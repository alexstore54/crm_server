import { BadRequestException, Injectable } from '@nestjs/common';
import { SignInAgent } from '@/modules/auth/dto/agent/sign-in.dto';
import { AgentRepository } from '@/modules/agent/repositories/agent.repository';
import { ERROR_MESSAGES } from '@/shared/constants/errors';
import { BcryptHelper } from '@/shared/helpers';
import { AuthAgentLoginInput } from '@/modules/auth/types/auth.type';
import { PermissionsUtil } from '@/shared/utils/permissions/permissions.util';
import { AgentPermissionsService } from '@/modules/permissions/service';

@Injectable()
export class AuthAgentService {
  constructor(
    private readonly agentRepository: AgentRepository,
    private readonly agentPermissionsService: AgentPermissionsService,
  ) {}

  public async validate(data: SignInAgent): Promise<AuthAgentLoginInput> {
    const { email, password } = data;

    const agent = await this.agentRepository.findOneByEmailWithDesksAndTeams(email);
    if (!agent) {
      throw new BadRequestException(ERROR_MESSAGES.INVALID_CREDS);
    }

    const isPasswordMatch = await BcryptHelper.compare(password, agent.password);

    if (!isPasswordMatch) {
      throw new BadRequestException(ERROR_MESSAGES.INVALID_CREDS);
    }

    const agentPermissions = await this.agentPermissionsService.getManyWithDetailsByAgentId(
      agent.id,
    );

    const permissionsTable =
      PermissionsUtil.mapPrismaPermissionsToPermissionTable(agentPermissions);

    return {
      agent,
      permissions: permissionsTable,
      desksPublicId: agent.Desk.length > 0 ? agent.Desk.map((desk) => desk.publicId) : [],
      teamsPublicId: agent.Team.length > 0 ? agent.Team.map((team) => team.publicId) : [],
    };
  }
}
