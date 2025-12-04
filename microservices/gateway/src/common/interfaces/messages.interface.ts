// src/common/interfaces/messages.interface.ts

/**
 * Patrones de comandos para comunicación TCP entre Gateway y microservicios.
 */

export const AUTH_COMMANDS = {
  REGISTER: { cmd: 'auth_register' },
  LOGIN: { cmd: 'auth_login' },
  REFRESH: { cmd: 'auth_refresh' },
  LOGOUT: { cmd: 'auth_logout' },
  LOGOUT_ALL: { cmd: 'auth_logout_all' },
  VALIDATE_TOKEN: { cmd: 'auth_validate_token' },


  // 🔥 NUEVOS COMANDOS DE RECUPERACIÓN
  RECUP_SOLICITAR: { cmd: 'recup_solicitar' },
  RECUP_VERIFICAR: { cmd: 'recup_verificar' },
  RECUP_RESTABLECER: { cmd: 'recup_restablecer' },


  // 👈 COMANDO PARA LOGIN CON GOOGLE
  LOGIN_GOOGLE: { cmd: 'login_google' },  // 👈 NUEVO


} as const;



export const AUTH_CONFIG_COMMANDS = {
  GET: { cmd: 'auth_config_get' },
  UPDATE: { cmd: 'auth_config_update' },
} as const;



export const USER_COMMANDS = {
  FIND_BY_ID: { cmd: 'user_find_by_id' },
  UPDATE_PROFILE: { cmd: 'user_update_profile' },
} as const;

export const ORGANIZATION_COMMANDS = {
  CREATE_ORG: { cmd: 'org_create' },
  GET_ORG: { cmd: 'org_get' },
} as const;
