// src/modules/auth/auditoria/auditoria.commands.ts
export const AUDITORIA_COMMANDS = {
  REGISTRAR: { cmd: 'audit_registrar' },
  BUSCAR: { cmd: 'audit_buscar' },
  POR_USUARIO: { cmd: 'audit_user' },
} as const;
