//src/modules/auth/core/auth.service.ts

import { Injectable } from '@nestjs/common';

import { RegisterService } from './register.service';
import { LoginService } from './login.service';
import { RefreshService } from './refresh.service';
import { LogoutService } from './logout.service';
import { ValidateTokenService } from './validate-token.service';

import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly registerService: RegisterService,
    private readonly loginService: LoginService,
    private readonly refreshService: RefreshService,
    private readonly logoutService: LogoutService,
    private readonly validateTokenService: ValidateTokenService,
  ) {}

  // === API ORIGINAL DEL GATEWAY ===

  register(dto: RegisterDto) {
    return this.registerService.register(dto);
  }

  login(dto: LoginDto) {
    return this.loginService.login(dto);
  }

  refresh(refreshToken: string) {
    return this.refreshService.refresh(refreshToken);
  }

  logout(userId: string, params: { sessionId?: string }) {
    return this.logoutService.logout(userId, params.sessionId);
  }

  logoutAll(userId: string, sessions?: string[]) {
    return this.logoutService.logoutAll(userId, sessions);
  }

  validateToken(token: string) {
    return this.validateTokenService.validateToken(token);
  }
}
