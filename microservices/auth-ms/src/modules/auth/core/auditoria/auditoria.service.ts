// src/modules/auth/core/auditoria/auditoria.service.ts
import { Injectable } from '@nestjs/common';
import { AuditoriaRepository } from './auditoria.repository';
import type { RegistrarAuditoriaDto } from './auditoria.types';
import { cleanIp, cleanUA } from './auditoria.util';

@Injectable()
export class AuditoriaService {
  constructor(private readonly repo: AuditoriaRepository) {}

  async registrar(dto: RegistrarAuditoriaDto) {
    // Extraemos ip y userAgent para tratarlos aparte
    const { ip, userAgent, detalle, ...rest } = dto;

    const detalleFinal = {
      ...(detalle ?? {}),
      ip: cleanIp(ip),
      userAgent: cleanUA(userAgent),
    };

    return this.repo.crear({
      ...rest,
      detalle: detalleFinal,
    });
  }

  // Casos de uso específicos
  async login(userId: string, ip?: string, userAgent?: string) {
    return this.registrar({
      entidad: 'auth',
      accion: 'login',
      realizadoPor: userId,
      ip,
      userAgent,
    });
  }

  async logout(userId: string, ip?: string, userAgent?: string) {
    return this.registrar({
      entidad: 'auth',
      accion: 'logout',
      realizadoPor: userId,
      ip,
      userAgent,
    });
  }

  async cambioPassword(userId: string) {
    return this.registrar({
      entidad: 'usuario',
      accion: 'cambio_password',
      realizadoPor: userId,
    });
  }

  async crearOrganizacion(userId: string, orgId: string) {
    return this.registrar({
      entidad: 'organizacion',
      accion: 'crear_organizacion',
      realizadoPor: userId,
      entidadId: orgId,
    });
  }

  async crearRol(userId: string, rolId: string) {
    return this.registrar({
      entidad: 'rol',
      accion: 'crear_rol',
      realizadoPor: userId,
      entidadId: rolId,
    });
  }

  async asignarPermiso(userId: string, permiso: string) {
    return this.registrar({
      entidad: 'permiso',
      accion: 'asignar_permiso',
      realizadoPor: userId,
      detalle: { permiso },
    });
  }

  async invitacion(email: string | null) {
    return this.registrar({
      entidad: 'invitacion',
      accion: 'invitacion_enviada',
      detalle: { email },
    });
  }
}
