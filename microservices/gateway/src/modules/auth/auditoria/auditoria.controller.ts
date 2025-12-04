// src/modules/auth/auditoria/auditoria.controller.ts

import { Controller, Get, Query, Param } from '@nestjs/common';
import { AuditoriaGatewayService } from './auditoria.service';
import { Roles } from '../../../common/decorators/roles.decorator';

@Controller('auditoria')
export class AuditoriaController {
  constructor(private readonly audit: AuditoriaGatewayService) {}

  @Get()
  @Roles('ADMIN')
  buscar(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    return this.audit.buscar(Number(page), Number(limit));
  }

  @Get('usuario/:id')
  @Roles('ADMIN')
  porUsuario(
    @Param('id') usuarioId: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    return this.audit.porUsuario(usuarioId, Number(page), Number(limit));
  }
}
