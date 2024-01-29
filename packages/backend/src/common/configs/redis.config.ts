import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

export const redisConfig = {
  host: configService.get('REDIS_HOST'),
  port: +configService.get('REDIS_PORT'),
  username: configService.get('REDIS_USERNAME'),
  password: configService.get('REDIS_PASSWORD'),
  db: +configService.get('REDIS_DATABASE')
};
