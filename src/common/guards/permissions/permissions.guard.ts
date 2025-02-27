import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthRedisService } from '@/shared/services/redis/auth-redis';
import { AgentAuthPayload } from '@/shared/types/auth';
import { agentAuthPayloadSchema } from '@/shared/schemas/auth-payload.schema';
import { ERROR_MESSAGES } from '@/shared/constants/errors';
import { Reflector } from '@nestjs/core';
import { PermissionsKeys } from '@/shared/types/auth/permissions.type';
import { DECORATORS_METADATA } from '@/shared/constants/metadata';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly authRedisService: AuthRedisService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const payload: AgentAuthPayload = request.user;
    const { error } = agentAuthPayloadSchema.validate(payload);
    if (error) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_TOKEN);
    }
    const requiredPermission = this.reflector.get<PermissionsKeys>(
      DECORATORS_METADATA.REQUIRED_PERMISSION,
      context.getHandler(),
    );

    if (!requiredPermission) {
      throw new ForbiddenException(ERROR_MESSAGES.REQUIRED_PERMISSION);
    }

    const { payloadUUID, sub } = payload;

    const permissions = await this.authRedisService.getOnePermissions(sub, payloadUUID);

    if (!permissions || !permissions[requiredPermission]) {
      throw new ForbiddenException(ERROR_MESSAGES.PERMISSIONS_NOT_PROVIDED);
    }

    return permissions[requiredPermission];
  }
}