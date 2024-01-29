import { Injectable } from '@nestjs/common';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { Channel } from 'amqplib';
import { RABBITMQ_URL } from '../../common/configs';
import { QUEUES } from '../../common/constants';

@Injectable()
export class ProducerService {
  private channelWrapper: ChannelWrapper;

  public constructor() {
    const connection = amqp.connect(RABBITMQ_URL);
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
