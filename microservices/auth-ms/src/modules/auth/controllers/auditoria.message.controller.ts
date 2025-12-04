// src/modules/auth/controllers/auditoria.message.controller.ts

import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { AuditoriaService } from '../core/auditoria/auditoria.service';
import { AuditoriaRepository } from '../core/auditoria/auditoria.repository';
import { AUDITORIA_COMMANDS } from '../core/auditoria/auditoria.commands';

import type {
  RegistrarAuditoriaDto,
  BuscarAuditoriaDto,
  BuscarPorUsuarioDto,
} from '../core/auditoria/auditoria.types';

@Controller()
export class AuditoriaMessageController {
  constructor(
    private readonly audit: AuditoriaService,
    private readonly repo: AuditoriaRepository,
  ) {}

  @MessagePattern(AUDITORIA_COMMANDS.REGISTRAR)
  registrar(@Payload() dto: RegistrarAuditoriaDto) {
    return this.audit.registrar(dto);
  }

  @MessagePattern(AUDITORIA_COMMANDS.BUSCAR)
  buscar(@Payload() dto: BuscarAuditoriaDto) {
    return this.repo.buscar(dto.page, dto.limit);
  }

  @MessagePattern(AUDITORIA_COMMANDS.POR_USUARIO)
  porUsuario(@Payload() dto: BuscarPorUsuarioDto) {
    return this.repo.porUsuario(dto.usuarioId, dto.page, dto.limit);
  }
}
