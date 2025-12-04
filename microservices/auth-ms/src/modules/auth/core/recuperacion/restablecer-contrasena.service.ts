//src/modules/auth/core/recuperacion/restablecer-contrasena.service.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RedisService } from '../../../../common/cache/redis.service';
import { PrismaService } from '../../../../common/database/prisma.service';
import { PasswordService } from '../../../../common/security/password.service';
import { SessionService } from '../sessions/session.service';
import { hmacSha256 } from '../../../../common/utils/crypto.util';

@Injectable()
export class RestablecerContrasenaService {
  constructor(
    private readonly redis: RedisService,
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly sesiones: SessionService,
  ) {}

  async restablecer(email: string, rst: string, nuevaContrasena: string) {
    const correo = email.trim().toLowerCase();

    const guardado = await this.redis.get<string>(
      `recuperacion-rst:${correo}`,
    );
    if (!guardado) {
      throw new UnauthorizedException('Token expirado o inválido.');
    }

    const rstHash = hmacSha256(rst, process.env.JWT_PEPPER ?? '');
    if (rstHash !== guardado) {
      throw new UnauthorizedException('Token RST inválido.');
    }

    // Buscar usuario real
    const usuario = await this.prisma.user.findUnique({
      where: { email: correo },
    });
    if (!usuario) {
      throw new UnauthorizedException('No autorizado.');
    }

    // Cambiar contraseña
    const hashNuevo = await this.passwordService.hashPassword(
      nuevaContrasena,
    );

    await this.prisma.user.update({
      where: { email: correo },
      data: { password: hashNuevo },
    });

    // Revocar sesiones activas
    const sesionesActivas = await this.prisma.sesion.findMany({
      where: { usuarioId: usuario.id, revocada: false },
    });

    for (const s of sesionesActivas) {
      await this.sesiones.revocarSesion(s.id);
    }

    // limpiar tokens
    await this.redis.del(`recuperacion:${correo}`);
    await this.redis.del(`recuperacion-rst:${correo}`);

    return { message: 'Contraseña actualizada correctamente.' };
  }
}
