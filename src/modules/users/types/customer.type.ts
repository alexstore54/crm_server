export type CreateCustomer = {
  public_id: string;
  lead_id: number;
  agent_id?: number;
  last_time_online: Date;
  password: string;
};
