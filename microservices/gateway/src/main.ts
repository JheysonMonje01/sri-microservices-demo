//src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('🚪 GATEWAY');

  try {
    const app = await NestFactory.create(AppModule);
    const port = process.env.PORT || 3000;

    const authHost = process.env.AUTH_MS_HOST || 'auth-ms';
    const authPort = process.env.AUTH_MS_PORT || '4001';

    logger.log('==============================');
    logger.log('Iniciando Gateway...');
    logger.log(`NODE_ENV: ${process.env.NODE_ENV || 'desconocido'}`);
    logger.log(`Puerto HTTP: ${port}`);
    logger.log(`Cliente TCP apuntando a Auth-MS → ${authHost}:${authPort}`);
    logger.log('==============================');

    await app.listen(port, '0.0.0.0');

    logger.log(`✅ Gateway iniciado y escuchando en http://0.0.0.0:${port}`);
  } catch (err: unknown) {
    const logger = new Logger('GATEWAY-ERROR');

    if (err instanceof Error) {
      logger.error('❌ Error crítico al iniciar el Gateway:', err.message);
      logger.error(err.stack);
    } else {
      logger.error('❌ Error desconocido al iniciar el Gateway:', err);
    }

    process.exit(1);
  }
}

bootstrap();
