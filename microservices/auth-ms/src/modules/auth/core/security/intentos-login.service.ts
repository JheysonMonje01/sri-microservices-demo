// src/modules/auth/core/security/intentos-login.service.ts
import { Injectable } from '@nestjs/common';
import { RedisService } from '../../../../common/cache/redis.service';
import { AuthConfigService } from '../../core/config/auth-config.service';
import { SeguridadConfig } from '../../core/config/auth-config.types';

@Injectable()
export class IntentosLoginService {
  private readonly PREFIX = 'login:fail:';

  constructor(
    private readonly redis: RedisService,
    private readonly config: AuthConfigService,
  ) {}

  /**
   * Incrementa e inmediatamente aplica el TTL dinámico configurado
   */
  async registrarIntento(email: string): Promise<number> {
    const key = `${this.PREFIX}${email}`;

    // 🔥 Leer seguridad desde config dinámica
    const seguridad = await this.config.get<SeguridadConfig>('seguridad');

    const ttl = seguridad.ttl_intentos ?? 900; // fallback por seguridad

    const attempts = await this.redis.incr(key);

    // aplicar TTL solo la primera vez
    if (attempts === 1) {
      await this.redis.expire(key, ttl);
    }

    return attempts;
  }

  /**
   * Limpia el contador de intentos
   */
  async limpiarIntentos(email: string): Promise<void> {
    const key = `${this.PREFIX}${email}`;
    await this.redis.del(key);
  }

  /**
   * Retorna el número actual de intentos
   */
  async obtenerIntentos(email: string): Promise<number> {
    const key = `${this.PREFIX}${email}`;

    const value = await this.redis.get<string | null>(key);
    if (!value) return 0;

    const parsed = Number(value);
    return isNaN(parsed) ? 0 : parsed;
  }
}
