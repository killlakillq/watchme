import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConsumerService } from '@core/queue/consumer.service';
import { ProducerService } from '@core/queue/producer.service';
import { EmailService } from '@core/email/email.service';

@Module({
  providers: [ProducerService, ConsumerService, EmailService, ConfigService]
})
export class QueueModule {}
