//src/modules/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { AuthController } from './auth.controller';
import { RecuperacionController } from './recuperacion.controller';
import { AuthService } from './auth.service';

import { GatewayAuthConfigModule } from './auth-config/auth-config.module';
import { FeatureFlagGatewayGuard } from 'src/common/guards/feature-flag.gateway.guard';
import { AuditoriaModule } from './auditoria/auditoria.module';

import { GoogleAuthModule } from './google/google.module';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.AUTH_MS_HOST ?? 'auth-ms',
          port: parseInt(process.env.AUTH_MS_PORT ?? '4001', 10),
        },
      },
    ]),

    GoogleAuthModule,
    GatewayAuthConfigModule,
    AuditoriaModule,
  ],

  controllers: [
    AuthController,
    RecuperacionController,
  ],

  providers: [
    AuthService,
    FeatureFlagGatewayGuard,
  ],

  exports: [AuthService],
})
export class AuthModule {}
