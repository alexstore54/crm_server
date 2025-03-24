import { PermissionsTable } from '@/shared/types/permissions';

//#REFACTORED - добавил тип для возвращения роли, убрал лишние дтошки

export type FullRole = {
  role: ClientRole,
  permissions: PermissionsTable
}

export type ClientRole = {
  id: number;
  name: string;
  publicId: string;
  avatarURL: string | null;
}