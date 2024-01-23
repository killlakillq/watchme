import { Module } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { ProducerService } from './producer.service';
import { EmailService } from '../email/email.service';

@Module({
  providers: [ProducerService, ConsumerService, EmailService],
  exports: [ProducerService, EmailService]
})
export class QueueModule {}
