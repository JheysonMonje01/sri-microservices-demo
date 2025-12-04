// src/common/guards/rpc-feature-flag.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AuthConfigService } from '../../modules/auth/core/config/auth-config.service';
import { FEATURE_FLAG_MAP } from '../../modules/auth/core/config/feature-flag.map';

// Tipo de comandos válidos
type CommandKey = keyof typeof FEATURE_FLAG_MAP;

interface MessagePatternMetadata {
  cmd?: string;
}

// ============================================
// ✔ Type guard seguro para validar comando
// ============================================
function isCommandKey(value: string | undefined): value is CommandKey {
  return value !== undefined && value in FEATURE_FLAG_MAP;
}

@Injectable()
export class RpcFeatureFlagGuard implements CanActivate {
  constructor(
    private readonly config: AuthConfigService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const handler = context.getHandler();

    // ============================================
    // Obtener metadata del patrón sin usar `any`
    // ============================================
    const pattern = this.reflector.get<MessagePatternMetadata>(
      'messagePattern',
      handler,
    );

    const rawCmd = pattern?.cmd;

    // ============================================
    // ✔ Aplicar type-guard
    // ============================================
    const cmd: CommandKey | undefined = isCommandKey(rawCmd)
      ? rawCmd
      : undefined;

    if (!cmd) return true; // no hay comando → no se aplica feature flag

    // ============================================
    // Buscar feature flag asociado
    // ============================================
    const flagKey = FEATURE_FLAG_MAP[cmd];

    if (!flagKey) return true; // este comando no usa flags

    // ============================================
    // Leer configuraciones desde BD o Redis
    // ============================================
    const features =
      await this.config.get<Record<string, boolean>>('features');

    const enabled = features?.[flagKey] === true;

    // ============================================
    // Bloquear si está deshabilitado
    // ============================================
    if (!enabled) {
      throw new ForbiddenException(
        `La función "${flagKey}" está deshabilitada temporalmente.`,
      );
    }

    return true;
  }
}
