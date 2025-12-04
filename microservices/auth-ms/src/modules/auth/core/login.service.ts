// src/modules/auth/core/login.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/database/prisma.service';
import { PasswordService } from '../../../common/security/password.service';
import { TokenUtil } from '../../../common/utils/token.util';
import { ConfigService } from '@nestjs/config';

import { LoginDto } from '../dto/login.dto';
import { IntentosLoginService } from './security/intentos-login.service';
import { AccountLockService } from './security/account-lock.service';
import { SessionService } from './sessions/session.service';

import { RpcException } from '@nestjs/microservices';
import { AuthConfigService } from './config/auth-config.service';
import { SeguridadConfig } from './config/auth-config.types';

@Injectable()
export class LoginService {
  private tokenUtil: TokenUtil;

  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly intentos: IntentosLoginService,
    private readonly locks: AccountLockService,
    private readonly sessions: SessionService,
    private readonly configSrv: AuthConfigService,
    private readonly config: ConfigService,
  ) {
    this.tokenUtil = new TokenUtil(config);
  }

  async login(dto: LoginDto) {
    const email = dto.email.trim().toLowerCase();

    // Leer seguridad dinámica
    const seguridad = await this.configSrv.get<SeguridadConfig>('seguridad');
    const maxIntentos = seguridad.max_intentos ?? 5;
    const bloqueoMs = (seguridad.ttl_intentos ?? 900) * 1000;

    // 1) Verifica si ya está bloqueado
    await this.locks.verificarBloqueo(email);

    // 2) Buscar usuario
    const user = await this.prisma.user.findUnique({ where: { email } });

    // =====================================================================
    // CASO: Usuario NO existe
    // =====================================================================
    if (!user) {
      const attempts = await this.intentos.registrarIntento(email);

      if (attempts >= maxIntentos) {
        await this.locks.crearBloqueo(
          email,
          null,
          bloqueoMs,
          `${attempts} intentos fallidos`,
        );
        await this.intentos.limpiarIntentos(email);
      }

      throw new RpcException({
        statusCode: 401,
        message: 'Credenciales incorrectas',
      });
    }

    // CASO: usuario desactivado
    if (!user.activo) {
      throw new RpcException({
        statusCode: 403,
        message: 'La cuenta está desactivada',
      });
    }

    // CASO: Contraseña incorrecta
    const valid = await this.passwordService.verifyPassword(
      user.password,
      dto.password,
    );

    if (!valid) {
      const attempts = await this.intentos.registrarIntento(email);

      if (attempts >= maxIntentos) {
        await this.locks.crearBloqueo(
          email,
          user.id,
          bloqueoMs,
          `${attempts} intentos fallidos`,
        );
        await this.intentos.limpiarIntentos(email);
      }

      throw new RpcException({
        statusCode: 401,
        message: 'Credenciales incorrectas',
      });
    }

    // LOGIN correcto - limpiar intentos
    await this.intentos.limpiarIntentos(email);

    // Cargar roles
    const orgRoles = await this.prisma.usuarioOrganizacion.findMany({
      where: { usuarioId: user.id },
      include: { rol: true },
    });
    const roles = orgRoles.map((r) => r.rol.nombre);

    // Tokens
    const { token: accessToken } = this.tokenUtil.createAccessToken({
      sub: user.id,
      email: user.email,
      roles,
    });

    const { token: refreshToken, hashed: refreshHash, expiresIn } =
      this.tokenUtil.createRefreshToken();

    const session = await this.sessions.crearSesion(
      user.id,
      refreshHash,
      expiresIn,
      dto.ip,
      dto.userAgent,
    );

    return {
      message: 'Inicio de sesión exitoso',
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
