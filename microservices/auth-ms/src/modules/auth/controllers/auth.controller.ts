import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  UseFilters,
} from '@nestjs/common';

import { AuthService } from '../core/auth.service';

import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';

import { Public } from '../../../common/decorators/public.decorator';
import { RefreshGuard } from '../../../common/guards/refresh.guard';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RpcExceptionFilter } from '../../../common/filters/rpc-exception.filter';

import type { LogoutRequest } from '../../../common/interfaces/http/logout-request.interface';
import type { Request } from 'express';

import { MessagePattern, Payload } from '@nestjs/microservices';
import { LoginGoogleService } from '../core/google/login-google.service';

// ================================
// 🔐 Tipo seguro para Request HTTP
// ================================
interface RequestHttp extends Request {
  ip: string;
  headers: Request['headers'] & {
    'user-agent'?: string;
  };
}

@Controller('auth')
@UseFilters(new RpcExceptionFilter())
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly loginGoogleService: LoginGoogleService, // ✔ NECESARIO
  ) {}

  // --------------------- REGISTER (HTTP)
  @Public()
  @Post('register')
  registerHttp(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  // --------------------- LOGIN (HTTP)
  @Public()
  @Post('login')
  loginHttp(@Body() dto: LoginDto, @Req() req: RequestHttp) {
    dto.ip = req.ip;
    dto.userAgent = req.headers['user-agent'] ?? '';
    return this.auth.login(dto);
  }

  // --------------------- REFRESH (HTTP)
  @Public()
  @UseGuards(RefreshGuard)
  @Post('refresh')
  refresh(@Req() req: Request & { refreshToken?: string }) {
    return this.auth.refresh(req.refreshToken!);
  }

  // --------------------- LOGOUT (HTTP)
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Req() req: LogoutRequest) {
    return this.auth.logout(req.user.sub, { sessionId: req.body.session_id });
  }

  // --------------------- LOGOUT ALL (HTTP)
  @Post('logout-all')
  @UseGuards(JwtAuthGuard)
  logoutAll(@Req() req: Request & { user: { sub: string } }) {
    return this.auth.logoutAll(req.user.sub);
  }

  //---------------------- LOGIN CON GOOGLE (TCP) 👈 NUEVO
  @MessagePattern({ cmd: 'login_google' })
  async loginGoogle(@Payload() data: { idToken: string }) {
    return await this.loginGoogleService.loginGoogle(data.idToken); // ✔ FIXED
  }
}
