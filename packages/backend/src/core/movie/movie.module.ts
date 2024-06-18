import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { MovieService } from '@core/movie/movie.service';
import { MovieProcessor } from '@core/movie/movie.processor';
import RedisRepository from '@infrastructure/database/repositories/redis.repository';
import { MovieController } from '@infrastructure/controllers/movie.controller';
import MovieRepository from '@infrastructure/database/repositories/movie.repository';
import { RedisStorage } from '@infrastructure/database/redis/redis.storage';
import WatchlistRepository from '@infrastructure/database/repositories/watchlist.repository';
import { QUEUES } from '@common/constants';
import { MovieDatabaseIntegration } from '@integrations/movie.integration';

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
    ConfigService,
    WatchlistRepository
  ]
})
export class MovieModule {}
