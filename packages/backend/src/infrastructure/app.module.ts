import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { AuthModule } from '../core/auth/auth.module';
import { MovieModule } from '../core/movie/movie.module';
import { ReviewModule } from '../core/review/review.module';
import { LoggerMiddleware } from '../common/middlewares/logger.middleware';
import { AppLogger } from '../helpers/logger.helper';
import LogsRepository from './database/repositories/logs.repository';
import { EmailModule } from '../core/email/email.module';
import { QueueModule } from '../core/queue/queue.module';

@Module({
  imports: [
    JwtModule.register({}),
    AuthModule,
    MovieModule,
    ReviewModule,
    EmailModule,
    QueueModule
  ],
  providers: [AppLogger, LogsRepository, PrismaClient]
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
