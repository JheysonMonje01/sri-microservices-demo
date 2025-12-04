// Respuesta que devuelve Google al intercambiar el "code" por tokens OAuth2.
export interface GoogleTokenResponse {
  access_token: string;
  id_token: string;
  refresh_token?: string;
  scope?: string;
  token_type?: string;
  expires_in?: number;
}
