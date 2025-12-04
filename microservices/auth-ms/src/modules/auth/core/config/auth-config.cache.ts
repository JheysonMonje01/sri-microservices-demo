//src/modules/auth/core/config/auth-config.cache.ts
import { Injectable } from '@nestjs/common';
import { RedisService } from '../../../../common/cache/redis.service';

@Injectable()
export class AuthConfigCache {
  private readonly PREFIX = 'authconfig:';
  private readonly CACHE_TTL = 3600; // 1 hora

  constructor(private readonly redis: RedisService) {}

  private formatKey(key: string): string {
    return `${this.PREFIX}${key}`;
  }

  async get<T>(key: string): Promise<T | null> {
    if (!key) return null;
    return this.redis.get<T>(this.formatKey(key));
  }

  async set<T>(key: string, value: T): Promise<void> {
    await this.redis.set(this.formatKey(key), value, this.CACHE_TTL);
  }

  async clear(key: string): Promise<void> {
    await this.redis.del(this.formatKey(key));
  }
}
