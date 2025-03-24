import { Role } from '@prisma/client';
import { ClientRole } from '@/shared/types/roles';

export class RolesUtil {
  public static mapRoleToClientRole(role: Role): ClientRole {
    return {
      id: role.id,
      name: role.name,
      publicId: role.publicId,
      avatarURL: role.avatarURL ? role.avatarURL : null,
    };
  }
}