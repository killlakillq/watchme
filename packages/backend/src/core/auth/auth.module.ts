import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { TokenService } from '@core/auth/token.service';
import { AccessTokenStrategy } from '@core/auth/strategies/access.strategy';
import { RefreshTokenStrategy } from '@core/auth/strategies/refresh.strategy';
import { AuthService } from '@core/auth/auth.service';
import { ProducerService } from '@core/queue/producer.service';
import { OpenService } from '@core/auth/open.service';
import { GoogleStrategy } from '@core/auth/strategies/google.strategy';
import { RedisStorage } from '@infrastructure/database/redis/redis.storage';
import UserRepository from '@infrastructure/database/repositories/user.repository';
import RedisRepository from '@infrastructure/database/repositories/redis.repository';
import { AuthController } from '@infrastructure/controllers/auth.controller';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserRepository,
    PrismaClient,
    TokenService,
    RedisRepository,
    RedisStorage,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    GoogleStrategy,
    JwtService,
    ProducerService,
    OpenService,
    ConfigService
  ]
})
export class AuthModule {}
