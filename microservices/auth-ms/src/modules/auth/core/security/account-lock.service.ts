// src/modules/auth/core/security/account-lock.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../common/database/prisma.service';
import { RpcException } from '@nestjs/microservices';
import { AuthConfigService } from '../../core/config/auth-config.service';

@Injectable()
export class AccountLockService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: AuthConfigService,
  ) {}

  private formatToEcuadorTime(date: Date): string {
    const offsetMs = -5 * 60 * 60 * 1000; // UTC-5
    const localDate = new Date(date.getTime() + offsetMs);

    return `${localDate.getFullYear()}-${String(
      localDate.getMonth() + 1,
    ).padStart(2, '0')}-${String(localDate.getDate()).padStart(
      2,
      '0',
    )} ${String(localDate.getHours()).padStart(
      2,
      '0',
    )}:${String(localDate.getMinutes()).padStart(
      2,
      '0',
    )}:${String(localDate.getSeconds()).padStart(2, '0')} (-05:00)`;
  }

  async verificarBloqueo(email: string) {
    const now = new Date();

    const bloqueo = await this.prisma.accountLock.findFirst({
      where: {
        blockedUntil: { gt: now },
        OR: [
          { email: email.toLowerCase().trim() },
          { usuario: { email: email.toLowerCase().trim() } },
        ],
      },
      include: { usuario: true },
    });

    if (bloqueo) {
      const fechaLocal = this.formatToEcuadorTime(bloqueo.blockedUntil);

      throw new RpcException({
        statusCode: 403,
        message: `La cuenta está bloqueada hasta ${fechaLocal}`,
      });
    }
  }

  async crearBloqueo(
    email: string,
    usuarioId: string | null,
    durationMs: number,
    reason: string,
  ) {
    const blockedUntil = new Date(Date.now() + durationMs);

    try {
      return await this.prisma.accountLock.create({
        data: {
          usuarioId,
          email,
          reason,
          blockedUntil,
          createdBy: usuarioId ?? undefined,
        },
      });
    } catch (err) {
      throw new RpcException({
        statusCode: 403,
        message: 'La cuenta ha sido bloqueada',
      });
    }
  }
}
