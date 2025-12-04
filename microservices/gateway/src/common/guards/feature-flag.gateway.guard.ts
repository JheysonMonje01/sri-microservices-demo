//src/common/guards/feature-flag.gateway.guard.ts
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import type { Request } from 'express';

import { AuthConfigGatewayService } from '../../modules/auth/auth-config/auth-config.service';

// Tipado seguro
export interface FeatureFlags {
  login_habilitado?: boolean;
  register_habilitado?: boolean;
  reset_password?: boolean;
}

@Injectable()
export class FeatureFlagGatewayGuard implements CanActivate {
  constructor(
    private readonly configService: AuthConfigGatewayService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (context.getType() !== 'http') return true;

    const req = context.switchToHttp().getRequest<Request>();
    const path = req.path ?? '';

    // ===== Cargar flags desde auth-ms =====
    const features = (await this.configService.get('features')) as FeatureFlags;

    // ===== Bloquear LOGIN =====
    if (path === '/auth/login' || path.startsWith('/auth/login')) {
      if (features?.login_habilitado === false) {
        throw new ForbiddenException(
          'El inicio de sesión está deshabilitado temporalmente.',
        );
      }
    }

    // ===== Bloquear REGISTER =====
    if (path === '/auth/register' || path.startsWith('/auth/register')) {
      if (features?.register_habilitado === false) {
        throw new ForbiddenException(
          'El registro de usuarios está deshabilitado temporalmente.',
        );
      }
    }

    // ===== Bloquear RECUPERACIÓN =====
    if (path.startsWith('/auth/recuperacion')) {
      if (features?.reset_password === false) {
        throw new ForbiddenException(
          'La recuperación de contraseña está deshabilitada temporalmente.',
        );
      }
    }

    return true;
  }
}
