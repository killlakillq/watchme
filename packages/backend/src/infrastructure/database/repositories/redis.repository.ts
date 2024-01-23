import { Injectable } from '@nestjs/common';
import { RedisStorage } from '../redis/redis.storage';

@Injectable()
export default class RedisRepository {
  public constructor(private readonly redisStorage: RedisStorage) {}

  public async set(key: string, data: string, ttl: number) {
    return this.redisStorage.set(key, data, ttl);
  }

  public async get(key: string) {
    return this.redisStorage.get(key);
  }
}
