import { Role } from '@prisma/client';
import { RoleForClient } from '@/shared/types/roles';

export class RolesUtil {
  public static mapRoleToClientRole(role: Role): RoleForClient {
    return {
      id: role.id,
      name: role.name,
      publicId: role.publicId,
      avatarURL: role.avatarURL ? role.avatarURL : null,
    };
  }
}