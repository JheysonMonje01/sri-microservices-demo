//src/modules/auth/core/logout.service.ts

import { Injectable } from '@nestjs/common';
import { SessionService } from './sessions/session.service';
import { PrismaService } from '../../../common/database/prisma.service';

@Injectable()
export class LogoutService {
  constructor(
    private readonly sessions: SessionService,
    private readonly prisma: PrismaService,
  ) {}

  async logout(userId: string, sessionId?: string) {
    if (!sessionId)
      throw new Error('No se pudo obtener sessionId');

    await this.sessions.revocarSesion(sessionId);
    return { message: 'Sesión cerrada' };
  }

  // 🔥 Opción A: obtener sesiones desde BD si NO se proporcionan
  async logoutAll(userId: string, activeSessions?: string[]) {
    // Si NO se envían sesiones → obtener todas las activas desde BD
    if (!activeSessions) {
      activeSessions = (
        await this.prisma.sesion.findMany({
          where: { usuarioId: userId, revocada: false },
        })
      ).map((s) => s.id);
    }

    // Revocar sesiones una por una
    for (const id of activeSessions) {
      await this.sessions.revocarSesion(id);
    }

    return { message: 'Todas las sesiones han sido cerradas' };
  }
}
