// import {
//   CanActivate,
//   ExecutionContext,
//   ForbiddenException,
// } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import { Reflector } from '@nestjs/core';
// import { JwtService } from '@nestjs/jwt';
// import { Roles } from '@prisma/client';
//
// export class RoleGuard implements CanActivate {
//   constructor(
//     private readonly reflector: Reflector,
//     private readonly jwtService: JwtService,
//   ) {}
//
//   canActivate(
//     context: ExecutionContext,
//   ): boolean | Promise<boolean> | Observable<boolean> {
//     const requiredRoles = this.reflector.get<Roles[]>(
//       'roles',
//       context.getHandler(),
//     );
//
//     if (!requiredRoles) {
//       return true;
//     }
//
//     const request = context.switchToHttp().getRequest();
//     const token = request.cookies['access_token'];
//     const user = this.jwtService.decode(token) as any;
//
//     if (!user) {
//       throw new ForbiddenException('Unauthorized');
//     }
//
//     const userRoles = user.roles || [];
//     const hasRole = requiredRoles.some((role) => userRoles.includes(role));
//     if (!hasRole) {
//       throw new ForbiddenException('Forbidden');
//     }
//
//     return true;
//   }
// }
