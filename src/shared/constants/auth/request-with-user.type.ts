import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: {
    access_token: string;
    refresh_token: string;
    userId: string;
    sub?: string;
  };
}
