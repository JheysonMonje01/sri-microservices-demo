// src/common/interfaces/auth-payload.interface.ts

/**
 * Payload del JWT entregado por el auth-ms.
 * El Gateway lo interpreta mediante JwtStrategy y lo inyecta en req.user.
 */
export interface AuthPayload {
  sub: string;       // ID del usuario
  email: string;
  roles: string[];   // Multi-rol soportado
}
