export interface CreateLeadInput {
  firstname: string;
  lastname: string;
  country?: string;
  email: string;
  agentId?: number;
  statusId?: number;
  phone: string;
}
 