//src/modules/auth/core/google/login-google.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../common/database/prisma.service';
import { GoogleAuthMsService } from './google-auth-ms.service';
import { SessionService } from '../sessions/session.service';
import { TokenUtil } from '../../../../common/utils/token.util';
import { RpcException } from '@nestjs/microservices';

import type { GooglePayload } from './google.types';

@Injectable()
export class LoginGoogleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly google: GoogleAuthMsService,
    private readonly sessions: SessionService,
    private readonly tokenUtil: TokenUtil,
  ) {}

  async loginGoogle(idToken: string) {
    // --------------------------------------------------
    // 1. Verificar token con Google
    // --------------------------------------------------
    const payload: GooglePayload | null = await this.google.verifyIdToken(idToken);

    if (!payload || !payload.email) {
      throw new RpcException({
        statusCode: 400,
        message: 'No se pudo verificar el token de Google',
      });
    }

    const email: string = payload.email.toLowerCase();

    // --------------------------------------------------
    // 2. Buscar usuario
    // --------------------------------------------------
    let user = await this.prisma.user.findUnique({ where: { email } });

    // --------------------------------------------------
    // 3. Crear usuario si no existe
    // --------------------------------------------------
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          nombre: payload.given_name ?? 'Sin nombre',
          apellido: payload.family_name ?? '',
          password: '',
          activo: true,
        },
      });

      const org = await this.prisma.organizacion.create({
        data: {
          nombre: `${user.nombre} ${user.apellido}`,
          tipo: 'PERSONAL',
          activo: true,
        },
      });

      const role = await this.prisma.rol.create({
        data: {
          nombre: 'cliente_comun',
          descripcion: 'Usuario estándar del sistema',
          orgId: org.id,
        },
      });

      await this.prisma.usuarioOrganizacion.create({
        data: {
          usuarioId: user.id,
          orgId: org.id,
          rolId: role.id,
        },
      });
    }

    // --------------------------------------------------
    // 4. Obtener roles
    // --------------------------------------------------
    const rolesDb = await this.prisma.usuarioOrganizacion.findMany({
      where: { usuarioId: user.id },
      include: { rol: true },
    });

    const roles = rolesDb.map((r) => r.rol.nombre);

    // --------------------------------------------------
    // 5. Crear JWT
    // --------------------------------------------------
    const { token: accessToken } = this.tokenUtil.createAccessToken({
      sub: user.id,
      email: user.email,
      roles,
    });

    const { token: refreshToken, hashed: refreshHash, expiresIn } =
      this.tokenUtil.createRefreshToken();

    // --------------------------------------------------
    // 6. Crear sesión (ip nullable FIX)
    // --------------------------------------------------
    const session = await this.sessions.crearSesion(
      user.id,
      refreshHash,
      expiresIn,
      undefined,     // IP debe ser string | undefined
      'google-oauth',
    );

    return {
      message: 'Login con Google exitoso',
      access_token: accessToken,
      refresh_token: refreshToken,
      session_id: session.id,
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        apellido: user.apellido,
        telefono: user.telefono,
        roles,
      },
    };
  }
}
