import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';
import { RABBITMQ_URL } from '../../common/configs';
import { QUEUES } from '../../common/constants';
import { EmailService } from '../email/email.service';
import { EmailMessageOptions } from '../../common/types';

@Injectable()
export class ConsumerService implements OnModuleInit {
  private channelWrapper: ChannelWrapper;

  private readonly logger = new Logger(ConsumerService.name);

  public constructor(private readonly emailService: EmailService) {
    const connection = amqp.connect(RABBITMQ_URL);
    this.channelWrapper = connection.createChannel();
  }

  public async onModuleInit() {
    try {
      await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
        await this.getMessageInEmailQueue(channel, QUEUES.EMAIL_EXCHANGE);
      });
      this.logger.log('Consumer service started and listening for messages.');
    } catch (err) {
      this.logger.error('Error starting the consumer:', err);
    }
  }

  private async getMessageInEmailQueue(channel: ConfirmChannel, exchange: string) {
    await channel.assertQueue(exchange, { durable: false });
    await channel.consume(exchange, async (message) => {
      if (message) {
        const parsedMessage: EmailMessageOptions = JSON.parse(message.content.toString());
        await this.emailService.sendEmail(parsedMessage);
        channel.ack(message);
      }
    });
  }
}
