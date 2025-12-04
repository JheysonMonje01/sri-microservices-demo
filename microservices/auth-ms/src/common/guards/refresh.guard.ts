// src/common/guards/refresh.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import type { Request } from 'express';

interface RefreshCookies {
  refresh_token?: string;
}

interface RefreshBody {
  refreshToken?: string;
}

/**
 * Sobrescribimos cookies y body para quitarles el `any` de Express.
 */
type RequestWithRefresh = Omit<Request, 'cookies' | 'body'> & {
  cookies: RefreshCookies;
  body: RefreshBody;
  refreshToken?: string;
};

@Injectable()
export class RefreshGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context
      .switchToHttp()
      .getRequest<RequestWithRefresh>();

    const headerToken = req.get('x-refresh-token') ?? undefined;
    const cookieToken = req.cookies.refresh_token ?? undefined;
    const bodyToken = req.body.refreshToken ?? undefined;

    const token = headerToken || cookieToken || bodyToken;

    if (!token) {
      return false;
    }

    // A partir de aquí TypeScript ya sabe que `token` es string
    req.refreshToken = token;

    return true;
  }
}
