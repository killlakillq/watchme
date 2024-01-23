import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import RedisRepository from '../../infrastructure/database/repositories/redis.repository';
import { AppLogger } from '../../helpers/logger.helper';
import { MovieService } from './movie.service';
import { MovieController } from '../../infrastructure/controllers/movie.contoller';
import MovieRepository from '../../infrastructure/database/repositories/movie.repository';
import { MovieDatabaseIntegration } from '../../integrations/movie.integration';
import { RedisStorage } from '../../infrastructure/database/redis/redis.storage';

@Module({
  imports: [],
  controllers: [MovieController],
  providers: [
    MovieService,
    PrismaClient,
    RedisRepository,
    MovieRepository,
    MovieDatabaseIntegration,
    AppLogger,
    RedisStorage,
    JwtService
  ]
})
export class MovieModule {}
