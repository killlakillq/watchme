import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import RedisRepository from '../../infrastructure/database/repositories/redis.repository';
import { MovieService } from './movie.service';
import { MovieController } from '../../infrastructure/controllers/movie.contoller';
import MovieRepository from '../../infrastructure/database/repositories/movie.repository';
import { MovieDatabaseIntegration } from '../../integrations/movie.integration';
import { RedisStorage } from '../../infrastructure/database/redis/redis.storage';
import { QUEUES } from '../../common/constants';
import { MovieProcessor } from './movie.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QUEUES.MOVIE
    })
  ],
  controllers: [MovieController],
  providers: [
    MovieService,
    PrismaClient,
    RedisRepository,
    MovieRepository,
    MovieDatabaseIntegration,
    RedisStorage,
    JwtService,
    MovieProcessor,
    ConfigService
  ]
})
export class MovieModule {}
