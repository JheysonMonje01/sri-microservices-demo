// src/common/decorators/current-user-decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthPayload } from '../interfaces/auth-payload.interface';

interface RequestWithUser extends Request {
  user?: AuthPayload;
}

/**
 * Decorador para obtener el usuario autenticado desde el request.
 * 
 * - Si el endpoint está protegido por JwtAuthGuard, `req.user`
 *   es el AuthPayload retornado por JwtStrategy (incluye roles: string[]).
 *
 * Uso:
 *   @CurrentUser() user: AuthPayload
 *   @CurrentUser('email') email: string | null
 */
export const CurrentUser = createParamDecorator(
  (data: keyof AuthPayload | undefined, ctx: ExecutionContext): any => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (!user) return null;

    if (data) {
      return user[data] ?? null;
    }

    return user;
  },
);
