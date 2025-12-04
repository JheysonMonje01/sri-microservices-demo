//src/modules/auth/auth.message.controller.ts

import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { AUTH_COMMANDS } from '../../common/interfaces/messages.interface';

import { AuthService } from './core/auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { LogoutDto } from './dto/logout.dto';
import { LogoutAllDto } from './dto/logout-all.dto';

import { RpcFeatureFlagGuard } from '../../common/guards/rpc-feature-flag.guard';
import { RpcConfigLoaderInterceptor } from '../../common/interceptors/rpc-config-loader.interceptor';

@Controller()
@UseGuards(RpcFeatureFlagGuard)
@UseInterceptors(RpcConfigLoaderInterceptor)
export class AuthMessageController {
  constructor(private readonly auth: AuthService) {}

  @MessagePattern(AUTH_COMMANDS.REGISTER)
  register(@Payload() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @MessagePattern(AUTH_COMMANDS.LOGIN)
  login(@Payload() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @MessagePattern(AUTH_COMMANDS.REFRESH)
  refresh(@Payload() dto: RefreshDto) {
    return this.auth.refresh(dto.refreshToken);
  }

  @MessagePattern(AUTH_COMMANDS.LOGOUT)
  logout(@Payload() dto: LogoutDto) {
    return this.auth.logout(dto.userId, { sessionId: dto.sessionId });
  }

  @MessagePattern(AUTH_COMMANDS.LOGOUT_ALL)
  logoutAll(@Payload() dto: LogoutAllDto) {
    return this.auth.logoutAll(dto.userId, dto.sessions);
  }

  @MessagePattern(AUTH_COMMANDS.VALIDATE_TOKEN)
  validateToken(@Payload() data: { token: string }) {
    if (typeof this.auth.validateToken !== 'function') {
      return { valid: false, message: 'validateToken no implementado' };
    }
    return this.auth.validateToken(data.token);
  }
}
