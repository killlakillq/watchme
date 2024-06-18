import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, catchError, tap } from 'rxjs';
import LogRepository from '../../infrastructure/database/repositories/log.repository';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly timestamp = new Date().toISOString();
  private readonly logger = new Logger(this.timestamp);

  public constructor(private readonly logRepository: LogRepository) {}

  public intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const userAgent = request.get('user-agent') || '';
    const { method, path: url } = request;

    const requestMessage = `Method: ${method}, path: ${url}, userAgent: ${userAgent}`;

    this.logger.log(requestMessage);

    return next.handle().pipe(
      tap(({ status, message }) => {
        const responseMessage = `Status: ${status}, message: ${message}, path: ${url}, userAgent: ${userAgent}`;

        this.logger.log(responseMessage);
      }),
      catchError(async (error) => {
        const { statusCode, message, error: errorType } = error.response;

        const errorMessage = `Status: ${statusCode}, message: ${message}, path: ${url}, userAgent: ${userAgent}`;

        await this.logRepository.create({
          level: 'error',
          timestamp: this.timestamp,
          message,
          method,
          path: url,
          userAgent
        });

        this.logger.error(errorMessage);
        response.status(statusCode);

        return {
          status: statusCode,
          message,
          error: errorType
        };
      })
    );
  }
}
