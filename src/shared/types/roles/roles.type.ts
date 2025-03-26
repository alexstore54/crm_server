import { PermissionsTable } from '@/shared/types/permissions';

//#REFACTORED - добавил тип для возвращения роли, убрал лишние дтошки

export type FullRole = {
  role: RoleForClient,
  permissions: PermissionsTable
}

export type RoleForClient = {
  id: number;
  name: string;
  publicId: string;
  avatarURL: string | null;
}