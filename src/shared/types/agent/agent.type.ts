export type CreateAgent = {
    public_id: string;       
    role_id?: number;        
    email: string;
    password: string;
    last_time_online: Date;
    desk_ids?: number[];     
  };
  
  export type UpdateAgent = {
    role_id?: number;
    email?: string;
    password?: string;
    last_time_online?: Date;
    desk_ids?: number[];     
  };

