//src/common/interfaces/validate-token-response.interface.ts

// =======================================
// Usuario retornado por auth-ms
// =======================================
export interface ValidateTokenUser {
  id: string;
  email: string;
  roles: string[];
}

// =======================================
// Lo que retorna auth-ms directamente
// { valid, user }
// =======================================
export interface ValidateTokenMsResponse {
  valid: boolean;
  user: ValidateTokenUser | null;
}

// =======================================
// Lo que el gateway SIEMPRE recibe desde sendCommand():
// { message?: string; data: { valid, user } }
// =======================================
export interface ServiceResponse<T> {
  message?: string;
  data: T;
}

// =======================================
// Respuesta final del gateway para validateToken()
// =======================================
export type ValidateTokenGatewayResponse =
  ServiceResponse<ValidateTokenMsResponse>;
