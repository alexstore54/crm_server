import { RoleGuard } from '@/common/guards/permissions/roles.guard';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Role } from '@/common/decorators';
import { Roles } from '@prisma/client';

@Injectable()
export class AdminGuard extends RoleGuard {
  @Role(Roles.ADMIN, Roles.MODERATOR)
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }
}
