// src/modules/auth/core/auditoria/auditoria.types.ts
export interface RegistrarAuditoriaDto {
  entidad: string;
  accion: string;
  entidadId?: string | null;
  detalle?: Record<string, any>;
  realizadoPor?: string | null;

  ip?: string | null;
  userAgent?: string | null;
}

export interface BuscarAuditoriaDto {
  page: number;
  limit: number;
}

export interface BuscarPorUsuarioDto {
  usuarioId: string;
  page: number;
  limit: number;
}