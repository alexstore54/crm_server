import { Desk, LeadStatus, Phone, Team } from '@prisma/client';
import { AgentForClient } from '@/shared/types/agent';
import { UserEmail } from '@/shared/types/user/email.type';

export type FullLead = {
  lead: LeadForClient;
  desk: Desk | null;
  team: Team | null;
  status: LeadStatus | null;
  createdAt: Date;
  updatedAt: Date;
  isVerified: boolean;
  isOnline: boolean;
}

export type LeadForClient = {
  id: number;
  publicId: string;
  firstname: string;
  lastname: string;
  country?: string;
  email: string;
  phone: string;
}