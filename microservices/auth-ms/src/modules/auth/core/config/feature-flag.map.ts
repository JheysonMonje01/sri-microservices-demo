// src/modules/auth/core/config/feature-flag.map.ts

/**
 * Mapa entre comandos TCP y los feature flags que los habilitan.
 * Esto permite controlar dinámicamente qué funciones están activas.
 */

export const FEATURE_FLAG_MAP: Record<string, string> = {
  // LOGIN
  auth_login: 'login_habilitado',

  // REGISTER
  auth_register: 'register_habilitado',

  // RECUPERACIÓN DE CONTRASEÑA
  recup_solicitar: 'reset_password',
  recup_verificar: 'reset_password',
  recup_restablecer: 'reset_password',
};
