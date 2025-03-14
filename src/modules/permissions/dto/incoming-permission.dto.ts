import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class IncomingPermission {
  @IsNumber()
  permissionId: number;

  @IsOptional()
  @IsBoolean()
  allowed: boolean;
}
