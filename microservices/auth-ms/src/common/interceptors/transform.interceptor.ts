// src/common/interceptors/transform.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import type { Request } from 'express';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, { data: T; meta?: Record<string, unknown> }> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<{ data: T; meta: Record<string, unknown> }> {
    return next.handle().pipe(
      map((data: T) => {
        const req = context.switchToHttp().getRequest<Request>();
        return {
          data,
          meta: {
            path: req.url,
            timestamp: new Date().toISOString(),
          },
        };
      }),
    );
  }
}
