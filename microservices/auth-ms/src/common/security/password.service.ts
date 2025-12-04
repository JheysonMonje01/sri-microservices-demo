// src/common/security/password.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class PasswordService {
  private readonly options: argon2.Options & { raw?: false } = {
    type: argon2.argon2id, // Argon2id es el más recomendado por seguridad
    memoryCost: 2 ** 16,   // 64 MB → equilibra seguridad y rendimiento
    timeCost: 5,           // número de iteraciones (más alto = más seguro)
    parallelism: 2,        // número de hilos usados
  };

  /**
   * Genera un hash seguro para una contraseña.
   * Valida longitud mínima antes de encriptar.
   */
  async hashPassword(password: string): Promise<string> {
    if (typeof password !== 'string' || password.trim().length < 8) {
      throw new BadRequestException(
        'La contraseña debe tener al menos 8 caracteres.',
      );
    }

    const trimmed = password.trim();
    return await argon2.hash(trimmed, this.options);
  }

  /**
   * Verifica si una contraseña en texto plano coincide con su hash.
   * Retorna true o false, sin lanzar excepciones internas.
   */
  async verifyPassword(hash: string, plain: string): Promise<boolean> {
    if (!hash || !plain) return false;
    try {
      return await argon2.verify(hash, plain);
    } catch {
      return false;
    }
  }

  /**
   * Alias para mantener compatibilidad con AuthService
   * (comparePassword es el mismo proceso de verificación)
   */
  async comparePassword(plain: string, hash: string): Promise<boolean> {
    return this.verifyPassword(hash, plain);
  }
}

