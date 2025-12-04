// src/common/interfaces/auth-payload.interface.ts

export interface AuthPayload {
  sub: string;
  email: string;
  roles: string[];   // ✔️ SIEMPRE ARRAY
}
