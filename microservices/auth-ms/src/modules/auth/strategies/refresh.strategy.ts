// src/modules/auth/strategies/refresh.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';

/**
 * Request tipado para admitir cookies y refreshToken.
 */
export interface RefreshRequest extends Request {
  cookies: Record<string, string | undefined>;
  body: {
    refreshToken?: string;
    [key: string]: unknown;
  };
  refreshToken?: string;
}

@Injectable()
export class RefreshStrategy {
  /**
   * Método que extrae y valida el refresh token del request.
   */
  validate(req: RefreshRequest): string {
    const token =
      req.get('x-refresh-token') ??
      req.cookies?.refresh_token ??
      req.body?.refreshToken;

    if (!token) {
      throw new UnauthorizedException('Refresh token requerido');
    }

    return token;
  }
}
