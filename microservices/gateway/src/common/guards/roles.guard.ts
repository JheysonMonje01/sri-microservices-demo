//src/common/guards/roles.guard.ts

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthPayload } from '../interfaces/auth-payload.interface';

interface RequestWithUser extends Request {
  user?: AuthPayload;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const requiredRoles =
      this.reflector.get<string[]>('roles', ctx.getHandler()) ?? [];

    if (requiredRoles.length === 0) return true;

    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (!user) throw new ForbiddenException('Usuario no autenticado');

    const userRoles = Array.isArray(user.roles) ? user.roles : [];

    const authorized = requiredRoles.some((role) =>
      userRoles.includes(role),
    );

    if (!authorized)
      throw new ForbiddenException('No tiene permisos suficientes');

    return true;
  }
}
