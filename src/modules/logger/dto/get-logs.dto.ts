import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class GetLogs {
  @IsInt()
  @Min(1)
  readonly page: number;

  @IsInt()
  @Min(1)
  @Max(100)
  readonly limit: number;
}