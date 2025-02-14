export type Session = {
  userId: string;
  refreshToken: string;
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