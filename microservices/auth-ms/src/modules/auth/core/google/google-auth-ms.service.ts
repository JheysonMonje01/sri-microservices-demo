//src/modules/auth/core/google/google-auth-ms.service.ts
import { Injectable } from '@nestjs/common';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import type { GooglePayload } from './google.types';

@Injectable()
export class GoogleAuthMsService {
  private readonly client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  async verifyIdToken(idToken: string): Promise<GooglePayload | null> {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload() as TokenPayload | null;

      if (!payload || !payload.email) return null;

      const googlePayload: GooglePayload = {
        sub: payload.sub,
        email: payload.email,
        email_verified: payload.email_verified,
        given_name: payload.given_name,
        family_name: payload.family_name,
        picture: payload.picture,
        locale: payload.locale,
      };

      return googlePayload;
    } catch (err) {
      console.error('❌ Error verificando token de Google:', err);
      return null;
    }
  }
}
