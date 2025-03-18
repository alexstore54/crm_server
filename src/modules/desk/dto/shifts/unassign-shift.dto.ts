import { IsNumber } from 'class-validator';

export class UnassignShift {
  @IsNumber()
  agentId: number;
}