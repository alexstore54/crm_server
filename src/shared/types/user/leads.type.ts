export type UpdateLeads = {
    country?: string;
    first_name?: string
    second_name?: string
    status_id?: number
}


export type CreateLeads = {
    
    first_name: string;
    second_name: string;
    country: string;
    default_email?: string;
    status_id?: number;
}