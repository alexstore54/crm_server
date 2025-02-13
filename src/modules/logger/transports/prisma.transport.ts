import Transport from 'winston-transport';
import { LogsRepository } from '@/modules/logger/repositories';
import { CreateLog } from '@/modules/logger/dto';

export class PrismaTransport extends Transport {
  constructor(private logsRepository: LogsRepository, opts?: Transport.TransportStreamOptions) {
    super(opts);
  }

  async log(info: CreateLog, callback: () => void): Promise<void> {
    if (!info) {
      return callback();
    }

    setImmediate(() => {
      this.emit('logged', info);
    });

    await this.logsRepository.createLog(info);
    callback();
  }

}