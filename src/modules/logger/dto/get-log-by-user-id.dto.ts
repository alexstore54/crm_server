import { IsUUID } from 'class-validator';

export class GetLogByUserId {
    @IsUUID()
    readonly id: string;
}