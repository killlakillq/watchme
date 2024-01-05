import { Module } from '@nestjs/common';
import { AuthController } from '../../infrastructure/controllers/auth.controller';
import { TokenService } from './token.service';
import RedisRepository from '../../infrastructure/database/repositories/redis.repository';
import { AccessTokenStrategy } from './strategies/access.strategy';
import { RefreshTokenStrategy } from './strategies/refresh.strategy';
import AuthRepository from '../../infrastructure/database/repositories/auth.repository';
import { JwtService } from '@nestjs/jwt';
import { RedisStorage } from '../../infrastructure/database/redis/redis.storage';
import { PrismaClient } from '@prisma/client';
import { AuthService } from './auth.service';

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
    JwtService
  ]
})
export class AuthModule {}
