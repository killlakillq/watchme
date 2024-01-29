import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

export const nodemailerConfig = {
  host: configService.get('NODEMAILER_HOST'),
  port: +configService.get('NODEMAILER_PORT'),
  secure: false,
  auth: {
    user: configService.get('NODEMAILER_USERNAME'),
    pass: configService.get('NODEMAILER_PASSWORD')
  }
};
