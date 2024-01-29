import { BullModule } from '@nestjs/bull';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { AuthModule } from '../core/auth/auth.module';
import { MovieModule } from '../core/movie/movie.module';
import { ReviewModule } from '../core/review/review.module';
import LogsRepository from './database/repositories/logs.repository';
import { EmailModule } from '../core/email/email.module';
import { QueueModule } from '../core/queue/queue.module';
import { REDIS_OPTIONS } from '../common/configs';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';

@Module({
  imports: [
    BullModule.forRoot({
      redis: REDIS_OPTIONS
    }),
    JwtModule.register({}),
    AuthModule,
    MovieModule,
    ReviewModule,
    EmailModule,
    QueueModule
  ],
  providers: [
    LogsRepository,
    PrismaClient,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor
    }
  ]
})
export class AppModule {}
