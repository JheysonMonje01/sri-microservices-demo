//src/modules/auth/core/sessions/session.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../common/database/prisma.service';
import { RedisService } from '../../../../common/cache/redis.service';
import * as crypto from 'crypto';

@Injectable()
export class SessionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async crearSesion(userId: string, refreshHash: string, refreshTtl: number, ip?: string, userAgent?: string) {
    const expDate = new Date(Date.now() + refreshTtl * 1000);

    const session = await this.prisma.sesion.create({
      data: {
        usuarioId: userId,
        ip: ip ?? null,
        userAgent: userAgent ?? null,
        jwtId: crypto.randomUUID(),
        refreshTokenHash: refreshHash,
        expiraEn: expDate,
      },
    });

    await this.redis.set(
      `session:${session.id}`,
      { userId, jwtId: session.jwtId, refreshHash },
      refreshTtl,
    );

    return session;
  }

  async revocarSesion(sessionId: string) {
    await this.prisma.sesion.update({
      where: { id: sessionId },
      data: { revocada: true, revocadaEn: new Date() },
    });

    await this.redis.del(`session:${sessionId}`);
  }
}
