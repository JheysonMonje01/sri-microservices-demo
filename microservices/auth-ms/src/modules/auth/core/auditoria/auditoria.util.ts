// src/modules/auth/core/auditoria/auditoria.util.ts

export function cleanIp(ip?: string | null): string | undefined {
  if (!ip || typeof ip !== 'string') return undefined;

  const trimmed = ip.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function cleanUA(ua?: string | null): string | undefined {
  if (!ua || typeof ua !== 'string') return undefined;

  const trimmed = ua.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}
