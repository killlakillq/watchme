import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { AuthController } from '../../infrastructure/controllers/auth.controller';
import { TokenService } from './token.service';
import RedisRepository from '../../infrastructure/database/repositories/redis.repository';
import { AccessTokenStrategy } from './strategies/access.strategy';
import { RefreshTokenStrategy } from './strategies/refresh.strategy';
import AuthRepository from '../../infrastructure/database/repositories/auth.repository';
import { RedisStorage } from '../../infrastructure/database/redis/redis.storage';
import { AuthService } from './auth.service';
import { ProducerService } from '../queue/producer.service';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    PrismaClient,
    TokenService,
    RedisRepository,
    RedisStorage,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    JwtService,
    ProducerService
  ]
})
export class AuthModule {}
