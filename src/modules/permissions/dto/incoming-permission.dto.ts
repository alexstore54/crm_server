import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class IncomingPermission {
  @IsNumber()
  id: number;

  @IsOptional()
  @IsBoolean()
  allowed: boolean;
}
