import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class MutationAccessGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const params = request.params;

    if (user.id === params.id || user.routeAccess) {
      return true;
    } else {
      throw new ForbiddenException();
    }
  }
}
