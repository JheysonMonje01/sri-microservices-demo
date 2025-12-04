//src/modules/auth/controllers/recuperacion.controller.ts
import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AUTH_COMMANDS } from '../../../common/interfaces/messages.interface';

import { SolicitarRecuperacionService } from '../core/recuperacion/solicitar-recuperacion.service';
import { VerificarRecuperacionService } from '../core/recuperacion/verificar-recuperacion.service';
import { RestablecerContrasenaService } from '../core/recuperacion/restablecer-contrasena.service';

import { SolicitarRecuperacionDto } from '../dto/solicitar-recuperacion.dto';
import { VerificarRecuperacionDto } from '../dto/verificar-recuperacion.dto';
import { RestablecerContrasenaDto } from '../dto/restablecer-contraseña.dto';

import { RpcFeatureFlagGuard } from '../../../common/guards/rpc-feature-flag.guard';
import { RpcConfigLoaderInterceptor } from '../../../common/interceptors/rpc-config-loader.interceptor';


@Controller()
@UseGuards(RpcFeatureFlagGuard)
@UseInterceptors(RpcConfigLoaderInterceptor)
export class RecuperacionMessageController {
  constructor(
    private readonly solicitar: SolicitarRecuperacionService,
    private readonly verificar: VerificarRecuperacionService,
    private readonly restablecer: RestablecerContrasenaService,
  ) {}

  @MessagePattern(AUTH_COMMANDS.RECUP_SOLICITAR)
  solicitarRecup(@Payload() dto: SolicitarRecuperacionDto) {
    // Solo necesitamos el email; IP y userAgent los hemos simplificado
    return this.solicitar.solicitarRecuperacion(dto.email);
  }

  @MessagePattern(AUTH_COMMANDS.RECUP_VERIFICAR)
  verificarRecup(@Payload() dto: VerificarRecuperacionDto) {
    return this.verificar.verificar(dto.email, dto.token, dto.code);
  }

  @MessagePattern(AUTH_COMMANDS.RECUP_RESTABLECER)
  restablecerPass(@Payload() dto: RestablecerContrasenaDto) {
    return this.restablecer.restablecer(
      dto.email,
      dto.rst,
      dto.nuevaContrasena,
    );
  }
}
