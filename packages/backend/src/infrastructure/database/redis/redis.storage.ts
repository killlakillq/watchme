import Redis from 'ioredis';
import { REDIS_OPTIONS } from '../../../common/configs';

export class RedisStorage {
  private redis: Redis;

  public constructor() {
    this.redis = new Redis(REDIS_OPTIONS);
  }

  public async set(key: string, data: string, ttl: number) {
    await this.redis.set(key, data);
    return this.redis.expire(key, ttl);
  }

  public async get(key: string) {
    return this.redis.get(key);
  }
}
