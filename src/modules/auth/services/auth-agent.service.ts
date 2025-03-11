import { BadRequestException, Injectable } from '@nestjs/common';
import { SignInAgent } from '@/modules/auth/dto/agent/sign-in.dto';
import { AgentRepository } from '@/modules/agent/repositories/agent.repository';
import { ERROR_MESSAGES } from '@/shared/constants/errors';
import { BcryptHelper } from '@/shared/helpers';
import { AuthAgentLoginInput } from '@/modules/auth/types/auth.type';
import { PermissionsService } from '@/modules/permissions/service';
import { PermissionsUtil } from '@/shared/utils/permissions/permissions.util';

@Injectable()
export class AuthAgentService {
  constructor(
    private readonly agentRepository: AgentRepository,
    private readonly permissionsService: PermissionsService,
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

    const allowedPermissions = await this.permissionsService.getProcessedAgentPermissions(
      agent.id,
      agent.roleId,
    );
    const permissionsTable =
      PermissionsUtil.mapPermissionDetailToPermissionTable(allowedPermissions);

    return {
      agent,
      permissions: permissionsTable,
      deskPublicId: agent.Desk.map((desk) => desk.publicId),
      teamPublicId: agent.Team.length > 0 ? agent.Team.map((team) => team.publicId) : null,
    };
  }
}
