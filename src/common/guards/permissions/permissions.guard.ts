import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { AuthRedisService } from '@/shared/services/redis/auth-redis';
import { ERROR_MESSAGES } from '@/shared/constants/errors';
import { Reflector } from '@nestjs/core';
import { PermissionsKeys } from '@/shared/types/auth/permissions.type';
import { METADATA } from '@/shared/constants/metadata';
import { PermissionsTable } from '@/shared/types/redis';
import { AuthUtil } from '@/shared/utils/auth/auth.util';
import { PermissionOperation } from '@/shared/types/validation';
import { AgentAuthPayload } from '@/shared/types/auth';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly authRedisService: AuthRedisService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const payload: AgentAuthPayload = request.user;

    //Валидируем пэйлоад
    AuthUtil.validateAgentAuthPayload(payload);

    //достаем из контекста пермишины, хотябы у одного из них должно быть условие true
    //(сделано для того чтобы не делать большого количества эндроинтов)
    //(update_team_agent, update_desk_agent)
    const requiredPermissions = this.getRequiredPermissions(context);

    //достаем пермишны из редиса
    const permissions: PermissionsTable | null = await this.getPermissions(payload);

    //проверяем есть ли у пользователя пермишны
    this.checkPermissions(requiredPermissions, permissions);

    //достаем только те пермишны, которые есть у пользователя и задаем их в реквест
    request.permissions = this.getAgentPermissions(requiredPermissions, permissions);

    //закидываем тип операции
    request.operation = this.getOperation(request);
    return true;
  }

  private getAgentPermissions(
    requiredPermissions: PermissionsKeys[],
    permissions: PermissionsTable | null,
  ): PermissionsKeys[] {
    if (!permissions) {
      return [];
    }

    return requiredPermissions.filter(
      (permissionKey) => permissions[permissionKey as unknown as keyof PermissionsTable],
    );
  }

  private getRequiredPermissions(context: ExecutionContext): PermissionsKeys[] {
    const requiredPermissions = this.reflector.get<PermissionsKeys[]>(
      METADATA.REQUIRED_PERMISSIONS,
      context.getHandler(),
    );

    if (!requiredPermissions || !requiredPermissions.length) {
      throw new ForbiddenException(ERROR_MESSAGES.REQUIRED_PERMISSIONS);
    }

    return requiredPermissions;
  }

  private async getPermissions(payload: AgentAuthPayload): Promise<PermissionsTable | null> {
    const { payloadUUID, sub } = payload;
    return this.authRedisService.getOnePermissions(sub, payloadUUID);
  }

  private checkPermissions(
    requiredPermissions: PermissionsKeys[],
    permissions: PermissionsTable | null,
  ): void {
    if (
      !permissions ||
      !requiredPermissions.some(
        (permissionKey) => permissions[permissionKey as unknown as keyof PermissionsTable],
      )
    ) {
      throw new ForbiddenException(ERROR_MESSAGES.DONT_HAVE_RIGHTS);
    }
  }

  private getOperation(handlerName: string): PermissionOperation {
    if (handlerName.includes('create')) return 'create';
    if (handlerName.includes('update')) return 'update';
    if (handlerName.includes('delete')) return 'delete';
    return 'read';
  }
}
