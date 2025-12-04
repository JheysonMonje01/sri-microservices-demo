import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import type { Request } from 'express';

import { AuthService } from './auth.service';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';

import { RefreshGuard } from '../../common/guards/refresh.guard';
import { Public } from '../../common/decorators/public.decorator';
import { JwtRemoteAuthGuard } from '../../common/guards/jwt-remote.guard';
import { FeatureFlagGatewayGuard } from '../../common/guards/feature-flag.gateway.guard';

import { AuditAction } from '../../common/decorators/audit-action.decorator';

// =============================================================
// 🔐 Request extendido
// =============================================================
interface RequestHttp extends Request {
  ip: string;
  headers: Request['headers'] & {
    'user-agent'?: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // =====================================================
  // REGISTER
  // =====================================================
  @Public()
  @Post('register')
  @AuditAction('register')
  @UseGuards(FeatureFlagGatewayGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  register(@Body() dto: RegisterDto): Promise<any> {
    return this.authService.register(dto);
  }

  // =====================================================
  // LOGIN (usuario/contraseña)
  // =====================================================
  @Public()
  @Post('login')
  @AuditAction('login')
  @UseGuards(FeatureFlagGatewayGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  login(@Body() dto: LoginDto, @Req() req: RequestHttp): Promise<any> {
    const payload = {
      ...dto,
      ip: req.ip,
      userAgent: req.headers['user-agent'] ?? '',
    };
    return this.authService.login(payload);
  }

  // =====================================================
  // REFRESH TOKEN
  // =====================================================
  @Public()
  @Post('refresh')
  @UseGuards(RefreshGuard)
  refresh(
    @Req() req: Request & { refreshToken?: string },
  ): Promise<any> {
    return this.authService.refresh(req.refreshToken!);
  }

  // =====================================================
  // LOGOUT
  // =====================================================
  @Post('logout')
  @AuditAction('logout')
  @UseGuards(JwtRemoteAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  logout(
    @Body() body: LogoutDto,
    @Req() req: Request & { user: { sub: string } },
  ): Promise<any> {
    const sessionId = body.session_id ?? '';
    return this.authService.logout(req.user.sub, sessionId);
  }

  // =====================================================
  // LOGOUT ALL
  // =====================================================
  @Post('logout-all')
  @AuditAction('logout_all')
  @UseGuards(JwtRemoteAuthGuard)
  logoutAll(
    @Req() req: Request & { user: { sub: string } },
  ): Promise<any> {
    return this.authService.logoutAll(req.user.sub);
  }
}
