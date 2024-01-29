import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

export const GOOGLE = {
  CLIENT_ID: configService.get('GOOGLE_CLIENT_ID'),
  CLIENT_SECRET: configService.get('GOOGLE_CLIENT_SECRET'),
  CALLBACK_URL: configService.get('GOOGLE_CALLBACK_URL')
};
