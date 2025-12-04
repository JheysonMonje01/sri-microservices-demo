// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppConfigModule } from './common/config/config.module';
import { PrismaModule } from './common/database/prisma.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    AppConfigModule, // Configuración global
    PrismaModule,    // Base de datos
    AuthModule,      // Módulo de autenticación u otros
  ],
})
export class AppModule {}
