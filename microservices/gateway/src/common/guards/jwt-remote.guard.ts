//src/common/guards/jwt-remote.guard.ts

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { AuthService } from '../../modules/auth/auth.service';

@Injectable()
export class JwtRemoteAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);

    if (isPublic) return true;

    const req = ctx.switchToHttp().getRequest<Request>();
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    const token = authHeader.replace('Bearer ', '').trim();

    const result = await this.authService.validateToken(token);

    if (!result?.data?.valid) {
      throw new ForbiddenException('Token inválido o expirado');
    }

    // ================================================
    // Insertar req.user en el formato EXACTO que usa logout()
    // ================================================
    if (result.data.user) {
      req.user = {
        sub: result.data.user.id,
        email: result.data.user.email,
        roles: result.data.user.roles,
      };
    } else {
      // nunca debería ocurrir si valid == true
      req.user = undefined;
    }

    return true;
  }
}
