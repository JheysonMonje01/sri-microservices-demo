// src/common/guards/feature-flag.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthConfigService } from '../../modules/auth/core/config/auth-config.service';

// Tipado exacto de los feature flags
export interface FeatureFlags {
  [feature: string]: boolean;
}

@Injectable()
export class FeatureFlagGuard implements CanActivate {
  constructor(private readonly config: AuthConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Request HTTP estrictamente tipado
    const req: Request = context.switchToHttp().getRequest<Request>();

    /**
     * Obtenemos el path de forma segura:
     * - `req.path` está tipado como `string`
     * - quitamos query string si existiera
     */
    const rawPath = (req.path ?? req.originalUrl ?? '').split('?')[0];

    /**
     * Convertir "/auth/login" -> "auth-login"
     */
    const feature = rawPath
      .replace(/^\/+/, '') // quitar "/" inicial
      .replace(/\//g, '-') // "/" -> "-"
      .trim();

    /**
     * Obtener flags desde AuthConfig SIN usar genérico en la llamada,
     * y castear una sola vez a un tipo seguro.
     */
    const rawConfig = await this.config.get('features');
    const flags: FeatureFlags = (rawConfig ?? {}) as FeatureFlags;

    /**
     * Validación estricta sin ANY:
     * - si el flag no existe, es `undefined`
     * - sólo se considera habilitado si es `true` explícito
     */
    const isEnabled: boolean = flags[feature] === true;

    if (!isEnabled) {
      throw new ForbiddenException(
        `La función "${feature}" está deshabilitada temporalmente.`,
      );
    }

    return true;
  }
}
