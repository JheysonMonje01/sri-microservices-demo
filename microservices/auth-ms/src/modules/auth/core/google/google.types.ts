//src/modules/auth/core/google/google.type.ts
/**
 * Tipado oficial de la respuesta del ID Token de Google.
 * Este payload cumple con el estándar OpenID Connect.
 */
export interface GooglePayload {
  // CAMPO OBLIGATORIO
  email: string;

  // OPCIONALES
  email_verified?: boolean;
  name?: string;
  picture?: string;

  given_name?: string;
  family_name?: string;

  locale?: string;

  // Identificador único del usuario de Google
  sub?: string;
}
