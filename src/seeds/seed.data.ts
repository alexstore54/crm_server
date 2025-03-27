import { permissionsTableSchema } from '@/shared/schemas';
import { PermissionsKeys } from '@/shared/types/permissions';
import { SEEDS } from '@/shared/constants/seeds';

const { ROLE, DESK, AGENT } = SEEDS;

export const getModeratorSeedRole = () => {
  return {
    publicId: ROLE.MODERATOR.PUBLIC_ID,
    name: ROLE.MODERATOR.NAME,
    isVisible: ROLE.MODERATOR.IS_VISIBLE,
    isMutable: ROLE.MODERATOR.IS_MUTABLE,
  };
};

export const getNoAccessAgentSeedRole = () => {
  return {
    publicId: ROLE.UNSIGNED.PUBLIC_ID,
    name: ROLE.UNSIGNED.NAME,
    isVisible: ROLE.UNSIGNED.IS_VISIBLE,
    isMutable: ROLE.UNSIGNED.IS_MUTABLE,
  };
};

export const getLowAccessAgentSeedRole = () => {
  return {
    name: ROLE.LOW_ACCESS.NAME,
  };
};

// export const UnsignedAgent = () => {
//   return {
//     email: AGENT.UNSIGNED.EMAIL,
//     password: AGENT.UNSIGNED.PASSWORD
//   }
// }

// export const LowAccessAgent = () => {
//   return {
//     email: AGENT.LOW_ACCESS.EMAIL,
//     password: AGENT.LOW_ACCESS.EMAIL
//   }
// }

export const getUnsignedDesk = () => {
  return {
    publicId: DESK.UNSIGNED.PUBLIC_ID,
    name: DESK.UNSIGNED.NAME,
    avatarURL: DESK.UNSIGNED.AVATART_URL
  }
}

export const getCanadaDesk = () => {
  return {
    publicId: DESK.CA.PUBLIC_ID,
    name: DESK.CA.NAME,
    avatarURL: DESK.CA.AVATART_URL
  }
}

export const getItalyDesk = () => {
  return {
    publicId: DESK.IT.PUBLIC_ID,
    name: DESK.IT.NAME,
    avatarURL: DESK.IT.AVATART_URL

  }
}


export const getPermissions = (): string[] => {
  return Object.keys(permissionsTableSchema.describe().keys);
};

export const lowAccessPermissions = (): PermissionsKeys[] => {
  return [
    PermissionsKeys.READ_TEAM_AGENTS,
    PermissionsKeys.READ_TEAM_LEADS,
    PermissionsKeys.READ_DESKS,
    PermissionsKeys.READ_TEAMS,
    PermissionsKeys.UPDATE_HIMSELF,
  ];
};
