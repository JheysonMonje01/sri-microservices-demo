// src/common/decorators/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type { User } from '@prisma/client';

/**
 * Extrae el usuario autenticado desde request (seteado por el guard/passport)
 * Uso:
 *   @CurrentUser() user: User
 *   @CurrentUser('email') email: string
 *
 * Nota: el valor devuelto mantiene tipado para la clave pedida,
 *       y evita el uso de `any` usando `unknown` y mapeos seguros.
 */
export const CurrentUser = createParamDecorator(
  <K extends keyof User | undefined>(
    data: K,
    ctx: ExecutionContext,
  ): K extends keyof User ? User[K] | undefined : User | undefined => {
    const req = ctx.switchToHttp().getRequest<Request & { user?: User }>();
    const user = req.user;

    if (!user) {
      // No hay usuario en la request
      return undefined as K extends keyof User ? User[K] | undefined : User | undefined;
    }

    if (data) {
      // Acceso tipado a la propiedad solicitada sin usar `any`
      const keyed = user as unknown as Record<keyof User, unknown>;
      return keyed[data] as K extends keyof User ? User[K] | undefined : User | undefined;
    }

    // Devolver el usuario completo
    return user as K extends keyof User ? User[K] | undefined : User | undefined;
  },
);
