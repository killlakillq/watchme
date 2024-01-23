import { Injectable, Logger } from '@nestjs/common';
import { Transporter, createTransport } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { NODEMAILER_OPTIONS } from '../../common/configs';
import { EmailMessageOptions } from '../../common/types';

@Injectable()
export class EmailService {
  private transporter: Transporter<SMTPTransport.SentMessageInfo>;

  private readonly logger = new Logger(EmailService.name);

  public constructor() {
    this.transporter = createTransport(NODEMAILER_OPTIONS);
  }

  public async sendEmail(options: EmailMessageOptions) {
    try {
      const message = {
        from: NODEMAILER_OPTIONS.auth.user,
        to: options.email,
        subject: options.subject,
        html: options.html
      };
      await this.transporter.sendMail(message);
    } catch (error: unknown) {
      this.logger.error(error);
    }
  }
}
