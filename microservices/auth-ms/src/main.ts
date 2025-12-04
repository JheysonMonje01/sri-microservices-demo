//src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger, ValidationPipe } from '@nestjs/common';

// ⬇️ Tu filtro HTTP clásico
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap(): Promise<void> {
  const logger = new Logger('🔐 AUTH-MS');

  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const httpPort = Number(process.env.PORT) || 3000;
  const tcpHost = process.env.AUTH_MS_HOST ?? '0.0.0.0';
  const tcpPort = Number(process.env.AUTH_MS_PORT) || 4001;

  logger.log('==============================');
  logger.log('🚀 Iniciando Auth-MS...');
  logger.log(`🌍 Puerto HTTP: ${httpPort}`);
  logger.log(`🔌 Puerto TCP: ${tcpPort}`);
  logger.log('==============================');

  // 👇 Ya no guardamos la variable para evitar warnings
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: { host: tcpHost, port: tcpPort },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // 🟢 SOLO para HTTP
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.startAllMicroservices();
  await app.listen(httpPort, '0.0.0.0');

  logger.log(`✅ Auth-MS listo en puertos ${httpPort}/${tcpPort}`);
}

bootstrap();
