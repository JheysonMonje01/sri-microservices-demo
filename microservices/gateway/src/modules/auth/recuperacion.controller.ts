// src/modules/auth/recuperacion.controller.ts
import {
  Body,
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { AuthService } from './auth.service';

import { SolicitarRecuperacionDto } from './dto/solicitar-recuperacion.dto';
import { VerificarRecuperacionDto } from './dto/verificar-recuperacion.dto';
import { RestablecerContrasenaDto } from './dto/restablecer-contrasena.dto';
import { Public } from '../../common/decorators/public.decorator';
import { FeatureFlagGatewayGuard } from '../../common/guards/feature-flag.gateway.guard';

@Controller('auth/recuperacion')
@UseGuards(FeatureFlagGatewayGuard) // 👈 se aplica a todos los endpoints de recuperación
export class RecuperacionController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('solicitar')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  solicitar(@Body() dto: SolicitarRecuperacionDto) {
    return this.authService.solicitarRecuperacion(dto);
  }

  @Public()
  @Post('verificar')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  verificar(@Body() dto: VerificarRecuperacionDto) {
    return this.authService.verificarRecuperacion(dto);
  }

  @Public()
  @Post('restablecer')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  restablecer(@Body() dto: RestablecerContrasenaDto) {
    return this.authService.restablecerContrasena(dto);
  }
}
