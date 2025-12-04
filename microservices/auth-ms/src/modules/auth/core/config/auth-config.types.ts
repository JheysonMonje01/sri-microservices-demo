//src/modules/auth/core/config/auth-config.types.ts

export interface AuthConfigValue<T = any> {
  key: string;
  value: T;
}

export interface JwtConfig {
  access_seconds: number;
  refresh_seconds: number;
  refresh_rotation: boolean;
}

export interface SeguridadConfig {
  max_intentos: number;
  ttl_intentos: number;
  usar_ip_para_intentos: boolean;
}

export interface RolesBaseConfig {
  [rol: string]: string[];
}

export interface FeatureFlags {
  login_habilitado: boolean;
  register_habilitado: boolean;
  reset_password: boolean;
}

export interface AuthConfigBundle {
  jwt?: JwtConfig;
  seguridad?: SeguridadConfig;
  featureFlags?: FeatureFlags;
  rolesBase?: RolesBaseConfig;
}