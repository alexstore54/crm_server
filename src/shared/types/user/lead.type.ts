import { Customer, Desk, Email, Lead, LeadStatus, Phone, Team } from '@prisma/client';

export type FullLead = {
  lead: LeadForClient;
  adminInfo?: LeadAdminInfo;
  createdAt: Date;
  updatedAt: Date;
  isOnline: boolean;
};

export type LeadAdminInfo = {
  desk: Desk | null;
  team: Team | null;
  status: LeadStatus | null;
  lastOnline: Date | null;
};

export type PrismaLead = {
  lead: (Lead & { Phone: Phone[]; Desk: Desk; Team: Team; LeadStatus: LeadStatus });
  customerInfo: (Customer & { Email: Email[] }) | null;
};

export type LeadForClient = {
  id: number;
  avatarURL: string | null;
  publicId: string;
  isVerified?: boolean;
  firstname: string | null;
  lastname: string | null;
  country: string | null;
  defaultEmail: string;
  phone: string;
};
