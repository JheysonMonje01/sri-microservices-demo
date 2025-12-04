// src/common/database/prisma.service.ts
import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * ===========================================================
 *  FIX GLOBAL — BigInt → JSON seguro (sin errores TS)
 * ===========================================================
 */
declare global {
  interface BigInt {
    toJSON(): string;
  }
}


(BigInt.prototype as unknown as { toJSON(): string }).toJSON = function (
  this: bigint,
): string {
  return this.toString();
};

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('✅ Prisma conectado correctamente');
    } catch (error) {
      this.logger.error('❌ Error conectando Prisma:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.log('🛑 Prisma desconectado');
    } catch (error) {
      this.logger.error('❌ Error al desconectar Prisma:', error);
    }
  }
}
