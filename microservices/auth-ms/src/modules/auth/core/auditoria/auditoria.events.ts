// src/modules/auth/core/auditoria/auditoria.events.ts

export const AUDIT_ENTIDAD = {
  AUTH: 'auth',
  USUARIO: 'usuario',
  ORGANIZACION: 'organizacion',
  ROL: 'rol',
  PERMISO: 'permiso',
  INVITACION: 'invitacion',
} as const;

export const AUDIT_ACCION = {
  LOGIN: 'login',
  LOGOUT: 'logout',
  CAMBIO_PASSWORD: 'cambio_password',
  CREAR_ORGANIZACION: 'crear_organizacion',
  CREAR_ROL: 'crear_rol',
  ASIGNAR_PERMISO: 'asignar_permiso',
  INVITACION_ENVIADA: 'invitacion_enviada',
} as const;

export type AuditEntidadKey = keyof typeof AUDIT_ENTIDAD;
export type AuditAccionKey = keyof typeof AUDIT_ACCION;
