import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ValidationService } from '@/shared/services/validation';
import { ERROR_MESSAGES } from '@/shared/constants/errors';
import { TeamsPermissionValidation } from '@/shared/types/validation';
import { AgentRequest } from '@/shared/types/auth';

@Injectable()
export class TeamPermissionsGuard implements CanActivate {
  constructor(private readonly validationService: ValidationService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: AgentRequest = context.switchToHttp().getRequest();
    const { user, params, body, permissions, operation } = request;

    if (!permissions || !operation) {
      throw new InternalServerErrorException(ERROR_MESSAGES.PERMISSIONS_NOT_PROVIDED);
    }

    const validationArgs: TeamsPermissionValidation = {
      operation,
      permissions,
      currentAgentPayload: user,
      teamPublicId: params.publicId || body.publicId,
    };

    try {
      return await this.validationService.validateTeamOperationPermissions(validationArgs);
    } catch (error: any) {
      throw new InternalServerErrorException(`${ERROR_MESSAGES.DB_ERROR}: ${error.message}`);
    }
  }
}
