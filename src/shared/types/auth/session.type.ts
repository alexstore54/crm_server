export type SessionId = string;
export type SessionUUID = string;

export type Session = {
  userId: string;
  sessionUUID: SessionUUID;
  hashRefreshToken: string;
  fingerprint: string;
  userAgent: string;
  isOnline: boolean;
}

export interface UpdateSessionInput {
  refreshToken?: string;
  fingerprint?: string;
  userAgent?: string;
  isOnline?: boolean;
}