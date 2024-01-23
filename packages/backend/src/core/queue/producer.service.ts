import { Injectable } from '@nestjs/common';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { Channel } from 'amqplib';
import { RABBITMQ_URL } from '../../common/configs';
import { RABBITMQ } from '../../common/constants';

@Injectable()
export class ProducerService {
  private channelWrapper: ChannelWrapper;

  public constructor() {
    const connection = amqp.connect(RABBITMQ_URL);
    this.channelWrapper = connection.createChannel({
      setup: (channel: Channel) => channel.assertQueue(RABBITMQ.EMAIL_EXCHANGE, { durable: false })
    });
  }

  public async pushMessageToEmailQueue(message: unknown) {
    await this.channelWrapper.sendToQueue(
      RABBITMQ.EMAIL_EXCHANGE,
      Buffer.from(JSON.stringify(message)),
      {
        persistent: true
      }
    );
  }
}
