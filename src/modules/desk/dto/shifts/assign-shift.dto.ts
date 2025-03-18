import { IsNumber } from 'class-validator';

export class AssignShift {
  @IsNumber()
  agentId: number;
}