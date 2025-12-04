// src/common/interfaces/jwt-payload.interface.ts

export interface JwtPayload {
  sub: string;       // ID del usuario
  email: string;     // correo del usuario
  roles: string[];   // ✔️ la lista de roles REAL obtenida desde UsuarioOrganizacion
  iat?: number;
  exp?: number;
}

