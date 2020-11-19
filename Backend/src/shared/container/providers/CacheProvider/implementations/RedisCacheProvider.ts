import ChacheProvider from '../models/CacheProvider';
import Redis, { Redis as RedisClient } from 'ioredis';
import cacheConfig from '@config/cache';

export default class RedisCacheProvider implements ChacheProvider {
  private cliente: RedisClient;
  constructor() {
    this.cliente = new Redis(cacheConfig.config.redis);

  }

  public async save(key: string, value: string): Promise<void> {
    await this.cliente.set(key, JSON.stringify(value));
  }

  public async recover<T>(key: string): Promise<T | null> {
    const data = await this.cliente.get(key);
    if (!data) {
      return null
    }
    const parsedData = JSON.parse(data) as T;

    return parsedData;

  }

  public async invalidate(key: string): Promise<void> {
    await this.cliente.del(key);

  }

  public async invalidatePrefix(prefix: string): Promise<void> {
    const keys = await this.cliente.keys(`${prefix}:*`);

    const pipeline = this.cliente.pipeline();

    keys.forEach(key => pipeline.del(key));

    await pipeline.exec();


  }
}