//src/common/config/config.module.ts
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './configuration';
import { envValidationSchema } from './env.validation';

/**
 * AppConfigModule
 * 
 * Módulo global de configuración. Carga, valida y expone las variables de entorno.
 */
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: envValidationSchema,
      envFilePath: '.env', // 👈 Garantiza que lea tu .env raíz
    }),
  ],
})
export class AppConfigModule {}
