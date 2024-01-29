import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

export const JWT = {
  ACCESS_SECRET: configService.get('ACCESS_TOKEN_SECRET'),
  REFRESH_SECRET: configService.get('REFRESH_TOKEN_SECRET')
};
