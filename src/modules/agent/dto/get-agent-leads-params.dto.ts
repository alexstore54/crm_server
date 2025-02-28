import { IsUUID } from 'class-validator';

export class GetAgentLeadsParams {
  @IsUUID()
  publicId: string;
}
