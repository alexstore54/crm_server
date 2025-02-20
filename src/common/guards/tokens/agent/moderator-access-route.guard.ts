import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { RouteAccess } from '@prisma/client';

@Injectable()
export class ModeratorGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return user && user.routeAccess === RouteAccess.MODERATOR;
  }
}
