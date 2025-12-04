// src/modules/auth/auditoria/auditoria.module.ts

import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { AuditoriaController } from './auditoria.controller';
import { AuditoriaGatewayService } from './auditoria.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUDITORIA_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.AUTH_MS_HOST ?? 'auth-ms',
          port: parseInt(process.env.AUTH_MS_PORT ?? '4001', 10),
        },
      },
    ]),
  ],
  controllers: [AuditoriaController],
  providers: [AuditoriaGatewayService],
  exports: [AuditoriaGatewayService],
})
export class AuditoriaModule {}
