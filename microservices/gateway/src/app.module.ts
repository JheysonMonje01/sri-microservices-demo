//src/app.module.ts
import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

import { SecurityModule } from './common/security/security.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtRemoteAuthGuard } from './common/guards/jwt-remote.guard';

import { AuditInterceptor } from './common/interceptors/audit.interceptor';
import { AuditoriaModule } from './modules/auth/auditoria/auditoria.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SecurityModule,
    AuthModule,
    AuditoriaModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtRemoteAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
})
export class AppModule {}
