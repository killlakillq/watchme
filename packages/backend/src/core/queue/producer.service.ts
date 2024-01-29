import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { Channel } from 'amqplib';
import { QUEUES } from '../../common/constants';

@Injectable()
export class ProducerService {
  private channelWrapper: ChannelWrapper;

  public constructor(private readonly configService: ConfigService) {
    const url = this.configService.get('RABBITMQ_URL');
    const connection = amqp.connect(url);
    this.channelWrapper = connection.createChannel({
      setup: (channel: Channel) => channel.assertQueue(QUEUES.EMAIL_EXCHANGE, { durable: false })
    });
  }

  public async pushMessageToEmailQueue(message: unknown) {
    await this.channelWrapper.sendToQueue(
      QUEUES.EMAIL_EXCHANGE,
      Buffer.from(JSON.stringify(message)),
      {
        persistent: true
      }
    );
  }
}
