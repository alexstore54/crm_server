import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { Log } from '@prisma/client';
import { LogsService } from '@/modules/logger/services';
import { GetLogByUserId, GetLogs } from '@/modules/logger/dto';

@Controller('logs')
export class LogsController {
  constructor(private loggerService: LogsService) {
  }

  @Get()
  async getLogs(@Query() query: GetLogs): Promise<Log[]> {
    const { page, limit } = query;
    return this.loggerService.getLogs(page, limit);
  }

  @Get('/users/:id')
  async getLogsByUserId(@Param('id') params: GetLogByUserId): Promise<Log[]> {
    return this.loggerService.getLogsByUserId(params.id);
  }

  @Get('/:id')
  async getLogById(@Param('id', ParseIntPipe) id: number): Promise<Log | null> {
    return this.loggerService.getLogById(id);
  }
}