// src/common/cache/redis.module.ts
import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';
import IORedis, { Redis as IORedisClient } from 'ioredis';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      inject: [ConfigService],
      // devolvemos un IORedisClient; no hace falta una aserción extra al final
      useFactory: (configService: ConfigService): IORedisClient => {
        const host = configService.get<string>('REDIS_HOST', 'redis');
        const port = Number(configService.get<string>('REDIS_PORT') ?? 6379);
        const password = configService.get<string>('REDIS_PASSWORD') ?? undefined;

        const client = new IORedis({
          host,
          port,
          password,
          maxRetriesPerRequest: null,
        });

        client.on('error', (err) => {
          // Puedes reemplazar console.error por un logger central
          
          console.error('[Redis] error', err);
        });

        // devolvemos directamente el cliente
        return client;
      },
    },
    RedisService,
  ],
  exports: ['REDIS_CLIENT', RedisService],
})
export class RedisModule {}
