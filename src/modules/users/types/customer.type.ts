export type CreateCustomer = {
  leadId: number;
  agentId?: number;
  lastTimeOnline: Date;
  password: string;
};
