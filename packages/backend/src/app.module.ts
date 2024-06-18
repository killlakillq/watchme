import { BullModule } from '@nestjs/bull';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { AuthModule } from './core/auth/auth.module';
import { MovieModule } from './core/movie/movie.module';
import { ReviewModule } from './core/review/review.module';
import LogRepository from './infrastructure/database/repositories/log.repository';
import { EmailModule } from './core/email/email.module';
import { QueueModule } from './core/queue/queue.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { redisConfig } from './common/configs';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: `${process.cwd()}/../../.env` }),
    BullModule.forRoot({
      redis: redisConfig
    }),
    JwtModule.register({}),
    AuthModule,
    MovieModule,
    ReviewModule,
    EmailModule,
    QueueModule
  ],
  providers: [
    LogRepository,
    PrismaClient,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor
    }
  ]
})
export class AppModule {}
