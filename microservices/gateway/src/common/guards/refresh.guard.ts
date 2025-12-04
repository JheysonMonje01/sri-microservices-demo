// src/common/guards/refresh.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import type { Request } from 'express';

interface RequestWithRefresh extends Request {
  cookies: Record<string, string | undefined>;
  body: { refreshToken?: string };
  refreshToken?: string;
}

@Injectable()
export class RefreshGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<RequestWithRefresh>();

    const headerToken = req.get('x-refresh-token') ?? undefined;
    const cookieToken = req.cookies?.refresh_token ?? undefined;
    const bodyToken = req.body?.refreshToken ?? undefined;

    const token = headerToken || cookieToken || bodyToken;

    if (!token) return false;

    req.refreshToken = token;
    return true;
  }
}
