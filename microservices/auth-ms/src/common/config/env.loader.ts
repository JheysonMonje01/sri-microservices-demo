//src/common/config/env.loader.ts
import * as dotenv from 'dotenv';
import { resolve } from 'path';

/**
 * Carga el archivo .env desde la raíz del proyecto.
 * Esto asegura que Prisma y ConfigModule tengan las variables disponibles.
 */
export function loadEnv() {
  const envPath = resolve(__dirname, '../../../.env');
  const result = dotenv.config({ path: envPath });

  if (result.error) {
    console.warn(`⚠️  No se pudo cargar el archivo .env desde ${envPath}`);
  } else {
    console.log(`✅ Variables de entorno cargadas desde ${envPath}`);
  }
}


