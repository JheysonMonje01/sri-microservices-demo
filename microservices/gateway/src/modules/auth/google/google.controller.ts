//src/modules/auth/google/google.controller.ts
import {
  Controller,
  Get,
  Query,
  Res,
} from '@nestjs/common';

import type { Response } from 'express';

import { GoogleAuthService } from './google.service';
import { AuthService } from '../auth.service';
import { Public } from '../../../common/decorators/public.decorator';

@Controller('auth/google')
export class GoogleController {
  constructor(
    private readonly google: GoogleAuthService,
    private readonly authService: AuthService,
  ) {}

  @Public()
  @Get('redirect')
  googleRedirect(@Res() res: Response) {
    const url = this.google.getGoogleAuthUrl();
    return res.redirect(url);
  }

  @Public()
  @Get('callback')
  async googleLoginCallback(
    @Query('code') code: string,
    @Res() res: Response,
  ) {
    if (!code) {
      return res.redirect('http://localhost:5173/login/error?reason=no_code');
    }

    // 1. Intercambiar code -> tokens Google
    const tokens = await this.google.handleGoogleCallback(code);

    // 2. Enviar idToken al auth-ms via TCP
    const authResponse = await this.authService.loginWithGoogle(tokens.id_token);

    // 3. Validar respuesta
    const data = authResponse?.data;
    if (!data) {
      return res.redirect('http://localhost:5173/login/error?reason=auth_ms_failed');
    }

    // 4. Redirigir al frontend con tus JWT propios
    return res.redirect(
      `http://localhost:5173/login/success?` +
      `access=${encodeURIComponent(data.access_token ?? '')}` +
      `&refresh=${encodeURIComponent(data.refresh_token ?? '')}` +
      `&session=${encodeURIComponent(data.session_id ?? '')}`
    );
  }
}


