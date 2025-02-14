export type SessionId = string;

export type Session = {
  userId: string;
  hashRefreshToken: string;
  fingerprint: string;
  userAgent: string;
  isOnline: boolean;
  lastOnline: Date;
}

export interface UpdateSessionInput {
  refreshToken?: string;
  fingerprint?: string;
  userAgent?: string;
  isOnline?: boolean;
  lastOnline?: Date;
}