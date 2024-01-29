import Redis from 'ioredis';
import { redisConfig } from '../../../common/configs';

export class RedisStorage {
  private redis: Redis;

  public constructor() {
    this.redis = new Redis(redisConfig);
  }

  public async set(key: string, data: string, ttl: number) {
    await this.redis.set(key, data);
    return this.redis.expire(key, ttl);
  }

  public async get(key: string) {
    return this.redis.get(key);
  }
}
