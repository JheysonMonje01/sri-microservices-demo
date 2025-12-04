//src/modules/auth/google/google.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import type { GoogleTokenResponse } from './google.types';

@Injectable()
export class GoogleAuthService {
  private readonly clientId = process.env.GOOGLE_CLIENT_ID!;
  private readonly clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
  private readonly redirectUri = process.env.GOOGLE_REDIRECT_URI!;

  /**
   * Construye la URL de autorización de Google OAuth2.
   */
  getGoogleAuthUrl(): string {
    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';

    const options = {
      redirect_uri: this.redirectUri,
      client_id: this.clientId,
      access_type: 'offline',
      response_type: 'code',
      prompt: 'consent',
      scope: ['openid', 'email', 'profile'].join(' '),
    };

    const query = new URLSearchParams(options);

    return `${rootUrl}?${query.toString()}`;
  }

  /**
   * Intercambia el "code" por tokens de Google.
   * Devuelve el GoogleTokenResponse tipado.
   */
  async handleGoogleCallback(code: string): Promise<GoogleTokenResponse> {
    const tokenUrl = 'https://oauth2.googleapis.com/token';

    const body = new URLSearchParams({
      code,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: this.redirectUri,
      grant_type: 'authorization_code',
    });

    const response = await axios.post<GoogleTokenResponse>(
      tokenUrl,
      body.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    return response.data;
  }
}
