import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConsumerService } from './consumer.service';
import { ProducerService } from './producer.service';
import { EmailService } from '../email/email.service';

@Module({
  providers: [ProducerService, ConsumerService, EmailService, ConfigService]
})
export class QueueModule {}
