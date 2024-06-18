import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import UserRepository from '@infrastructure/database/repositories/user.repository';
import RedisRepository from '@infrastructure/database/repositories/redis.repository';
import { encrypt } from '@common/helpers/crypto.helper';
import { JWT, REDIS } from '@common/constants';
import { Tokens } from '@common/types';

@Injectable()
export class TokenService {
  public constructor(
    private readonly userRepository: UserRepository,
    private readonly redisRepository: RedisRepository,
    private readonly jwtService: JwtService
  ) {}

  public async updateRefreshToken(id: string, token: string): Promise<void> {
    const hashedRefreshToken = await encrypt(token);
    await this.userRepository.updateRefreshToken(id, hashedRefreshToken);
  }

  public async getTokens(id: string, email: string): Promise<Tokens> {
    const payload = {
      id,
      email
    };

    const [access, refresh] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: JWT.ACCESS_SECRET,
        expiresIn: '15m'
      }),
      this.jwtService.signAsync(payload, {
        secret: JWT.REFRESH_SECRET,
        expiresIn: '7d'
      })
    ]);

    const accessToken = await this.redisRepository.get(REDIS.ACCESS);
    const refreshToken = await this.redisRepository.get(REDIS.REFRESH);

    if (!accessToken || !refreshToken) {
      await this.redisRepository.set(REDIS.ACCESS, access, REDIS.EXPIRE);
      await this.redisRepository.set(REDIS.REFRESH, refresh, REDIS.EXPIRE);

      return {
        accessToken: access,
        refreshToken: refresh
      };
    }

    return {
      accessToken,
      refreshToken
    };
  }
}
