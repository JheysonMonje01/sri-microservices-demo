// src/modules/auth/core/auditoria/auditoria.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../common/database/prisma.service';
import type { RegistrarAuditoriaDto } from './auditoria.types';

@Injectable()
export class AuditoriaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async crear(dto: RegistrarAuditoriaDto) {
    return this.prisma.auditoria.create({
      data: {
        entidad: dto.entidad,
        entidadId: dto.entidadId ?? null,
        accion: dto.accion,
        detalle: dto.detalle ?? {},
        realizadoPor: dto.realizadoPor ?? null,
      },
    });
  }

  async buscar(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [total, data] = await Promise.all([
      this.prisma.auditoria.count(),
      this.prisma.auditoria.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return { total, data };
  }

  async porUsuario(usuarioId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [total, data] = await Promise.all([
      this.prisma.auditoria.count({
        where: { realizadoPor: usuarioId },
      }),
      this.prisma.auditoria.findMany({
        where: { realizadoPor: usuarioId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return { total, data };
  }
}
