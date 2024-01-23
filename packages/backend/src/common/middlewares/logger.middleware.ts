import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AppLogger } from '../../helpers/logger.helper';
import LogsRepository from '../../infrastructure/database/repositories/logs.repositories';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  public constructor(
    private readonly logger: AppLogger,
    private readonly logsRepository: LogsRepository
  ) {}

  public use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const userAgent = req.get('user-agent');
    const timestamp = new Date().toISOString();

    const requestMessage = `Request: method: ${method}, path: ${originalUrl}`;

    this.logger.log(requestMessage, {
      userAgent
    });

    res.on('finish', async () => {
      const { statusCode, statusMessage } = res;
      const responseMessage = `Response: ${statusCode} ${statusMessage}`;

      if (statusCode !== HttpStatus.OK && statusCode !== HttpStatus.CREATED) {
        await this.logsRepository.create({
          level: 'error',
          timestamp,
          message: responseMessage,
          method,
          path: originalUrl,
          userAgent
        });

        this.logger.error(responseMessage, {
          userAgent
        });
      } else {
        this.logger.log(responseMessage, {
          userAgent
        });
      }
    });

    next();
  }
}
