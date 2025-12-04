//src/modules/auth/core/config/auth-config.service.ts

import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../../common/database/prisma.service';
import { AuthConfigCache } from './auth-config.cache';
import { Prisma } from '@prisma/client';

interface UpdateResult<T> {
  message: string;
  key: string;
  value: T;
}

@Injectable()
export class AuthConfigService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: AuthConfigCache,
  ) {}

  // -------------------------------------------
  // Validar clave
  // -------------------------------------------
  private validateKey(key: string): void {
    if (!key || typeof key !== 'string') {
      throw new BadRequestException('Clave de configuración inválida');
    }
  }

  // -------------------------------------------
  // Obtener configuración
  // -------------------------------------------
  async get<T>(key: string): Promise<T> {
    this.validateKey(key);

    // 1. Intentar desde cache
    const cached = await this.cache.get<T>(key);
    if (cached !== null) return cached;

    // 2. Desde base de datos
    const row = await this.prisma.authConfig.findUnique({
      where: { key },
    });

    if (!row) {
      throw new BadRequestException(
        `auth_config: clave no encontrada → ${key}`,
      );
    }

    // 3. Guardar en cache
    await this.cache.set(key, row.value);

    return row.value as T;
  }

  // -------------------------------------------
  // Actualizar configuración
  // -------------------------------------------
  async update<T>(key: string, value: T): Promise<UpdateResult<T>> {
    this.validateKey(key);

    await this.prisma.authConfig.update({
      where: { key },
      data: {
        value: value as unknown as Prisma.InputJsonValue,
      },
    });

    // limpiar cache antiguo
    await this.cache.clear(key);

    // cachear nuevo valor
    await this.cache.set(key, value);

    return {
      message: 'Configuración actualizada correctamente',
      key,
      value,
    };
  }
}
