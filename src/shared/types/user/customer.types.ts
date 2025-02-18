export type CreateCustomer = {
    public_id: string;     // UUID в виде строки
    lead_id: number;       // Идентификатор связанного лида (обязательное поле)
    agent_id?: number;     // Идентификатор агента (необязательное поле)
    last_time_online: Date;
    password: string;      // Если требуется согласно модели
  };
  
  export type UpdateCustomer = {
    lead_id?: number;      // Если нужно изменить связь с лидом (не рекомендуется часто менять, так как связь обязательная)
    agent_id?: number;     // Если требуется изменить связь с агентом
    last_time_online?: Date;
    password?: string;
  };