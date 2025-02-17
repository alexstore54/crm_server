export type SessionId = string;
export type SessionUUID = string;

export type Session = {
  userId: string;
  // role: string;
  sessionUUID: SessionUUID;
  hashedRefreshToken: string;
  fingerprint: string;
  userAgent: string;
  isOnline: boolean;
}

export interface CreateSessionInput {
  userId: string;
  fingerprint: string;
  userAgent: string;
  isOnline: boolean;
  sessionUUID: SessionUUID,
  hashedRefreshToken?: string;
}

export interface UpdateSessionInput {
  refreshToken?: string;
  fingerprint?: string;
  userAgent?: string;
  isOnline?: boolean;
}