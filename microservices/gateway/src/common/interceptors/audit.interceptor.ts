// src/common/interceptors/audit.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import { AuditoriaGatewayService } from '../../modules/auth/auditoria/auditoria.service';
import { AUDIT_ACTION_KEY } from '../decorators/audit-action.decorator';

import type { Request } from 'express';

// ============================
// Tipos seguros
// ============================

interface RequestUser {
  sub?: string;
}

/**
 * SafeRequest: Corregido → NO extiende Request, solo lo intersecta.
 * Esto evita conflicto con `headers: IncomingHttpHeaders`.
 */
type SafeRequest = Request & {
  user?: RequestUser;
  headers: Record<string, string | undefined>;
  ip: string;
  method: string;
  path: string;
};

interface RpcError {
  message?: string;
  statusCode?: number;
}

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditInterceptor.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly audit: AuditoriaGatewayService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const action = this.reflector.get<string>(
      AUDIT_ACTION_KEY,
      context.getHandler(),
    );

    // Si el endpoint NO tiene @AuditAction no auditamos
    if (!action) return next.handle();

    const ctx = context.switchToHttp();
    const req = ctx.getRequest<SafeRequest>();

    const userId: string | null = req.user?.sub ?? null;
    const ip: string = req.ip ?? '';
    const userAgent: string = req.headers['user-agent'] ?? '';
    const entidad = 'auth';

    return next.handle().pipe(
      // ===============================
      // ÉXITO
      // ===============================
      tap(() => {
        this.audit
          .registrar({
            accion: action,
            entidad,
            realizadoPor: userId,
            ip,
            userAgent,
            detalle: {
              path: req.path,
              method: req.method,
            },
          })
          .catch((err) => {
            this.logger.error(`Error auditando acción ${action}:`, err);
          });
      }),

      // ===============================
      // ERROR (también se audita)
     // ===============================
        catchError((err: unknown) => {
        const rpcErr = err as RpcError;

        const errorMsg =
            typeof rpcErr?.message === 'string'
            ? rpcErr.message
            : 'Error desconocido';

        this.audit
            .registrar({
            accion: action,
            entidad,
            realizadoPor: userId,
            ip,
            userAgent,
            detalle: {
                error: errorMsg,
                path: req.path,
                method: req.method,
            },
            })
            .catch(() => {});

        return throwError(() => err);
        }),

    );
  }
}
