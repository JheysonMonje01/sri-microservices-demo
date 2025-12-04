//src/modules/auth/auth-config/auth-config.module.ts
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { AuthConfigGatewayService } from './auth-config.service';
import { AuthConfigController } from './auth-config.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_CONFIG_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.AUTH_MS_HOST ?? 'auth-ms',
          port: parseInt(process.env.AUTH_MS_PORT ?? '4001', 10),
        },
      },
    ]),
  ],
  controllers: [AuthConfigController],
  providers: [AuthConfigGatewayService],
  exports: [AuthConfigGatewayService],
})
export class GatewayAuthConfigModule {}
