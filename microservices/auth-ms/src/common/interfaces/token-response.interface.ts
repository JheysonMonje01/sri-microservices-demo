// src/common/interfaces/token-response.interface.ts
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
