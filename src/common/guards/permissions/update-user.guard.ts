// import {
//   CanActivate,
//   ExecutionContext,
//   ForbiddenException,
//   Injectable,
// } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { JwtService } from '@nestjs/jwt';
// import { Roles } from '@prisma/client';
// import { Request } from 'express';
//
// @Injectable()
// export class UpdateUserGuard implements CanActivate {
//   constructor(
//     private readonly reflector: Reflector,
//     private readonly jwtService: JwtService,
//   ) {}
//
//   canActivate(context: ExecutionContext): boolean {
//     const request = context.switchToHttp().getRequest<Request>();
//     const token = request.cookies['access_token'];
//     const user = this.jwtService.decode(token) as any;
//
//     if (!user) {
//       throw new ForbiddenException('Unauthorized');
//     }
//
//     const userIdFromPayload = user.sub;
//     const userRoles = user.roles || [];
//     const userIdFromRequest = request.params.id || request.body.id;
//
//     if (userIdFromPayload === userIdFromRequest) {
//       return true;
//     }
//
//     if (
//       userRoles.includes(Roles.ADMIN) ||
//       userRoles.includes(Roles.MODERATOR)
//     ) {
//       return true;
//     }
//
//     throw new ForbiddenException(
//       'You do not have permission to update this user',
//     );
//   }
// }
