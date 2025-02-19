import { Phone } from '@prisma/client';

export type CreateLeads = {
    first_name: string;
    second_name: string;
    country: string;
    default_email?: string;
    status_id?: number;
}