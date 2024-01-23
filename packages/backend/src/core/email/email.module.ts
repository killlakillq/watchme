import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { AppLogger } from '../../helpers/logger.helper';

@Module({
  providers: [EmailService, AppLogger],
  exports: [EmailService]
})
export class EmailModule {}
