export type CreateCustomer = {
  leadId: number;
  agentId?: number;
  lastOnline?: Date;
  password: string;
};
