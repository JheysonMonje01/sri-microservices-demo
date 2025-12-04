//src/modules/auth/auditoria/auditoria.service.ts
import {
  Injectable,
  Inject,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, TimeoutError } from 'rxjs';
import { timeout, catchError } from 'rxjs/operators';

import { AUDITORIA_COMMANDS } from './auditoria.commands';

// ===========================================
// 🔒 Tipo seguro para error RPC
// ===========================================
interface RpcError {
  message?: string;
  statusCode?: number;
  response?: {
    message?: string;
    statusCode?: number;
  };
}

@Injectable()
export class AuditoriaGatewayService {
  constructor(
    @Inject('AUDITORIA_SERVICE')
    private readonly client: ClientProxy,
  ) {}

  registrar(payload: any) {
    return this.send(AUDITORIA_COMMANDS.REGISTRAR, payload);
  }

  buscar(page: number, limit: number) {
    return this.send(AUDITORIA_COMMANDS.BUSCAR, { page, limit });
  }

  porUsuario(usuarioId: string, page: number, limit: number) {
    return this.send(AUDITORIA_COMMANDS.POR_USUARIO, {
      usuarioId,
      page,
      limit,
    });
  }

  // ===========================================
  // 🔥 Método seguro para enviar comandos TCP
  // ===========================================
  private async send(pattern: any, payload: any): Promise<any> {
    try {
      return await firstValueFrom(
        this.client.send(pattern, payload).pipe(
          timeout(7000),
          catchError((err) => {
            throw err;
          }),
        ),
      );
    } catch (error: unknown) {
      // ---------------------------------------
      // 🕒 Timeout explícito
      // ---------------------------------------
      if (error instanceof TimeoutError) {
        throw new HttpException(
          'Timeout comunicando con auth-ms',
          HttpStatus.GATEWAY_TIMEOUT,
        );
      }

      // ---------------------------------------
      // 🛡️ Asegurar que el error cumpla la estructura de RpcError
      // ---------------------------------------
      const e = error as RpcError;

      const message =
        e?.response?.message ??
        e?.message ??
        'Error remoto en auditoría';

      const status =
        e?.response?.statusCode ??
        e?.statusCode ??
        HttpStatus.BAD_GATEWAY;

      // ---------------------------------------
      // 🚨 Lanzamos error seguro y tipado
      // ---------------------------------------
      throw new HttpException(message, status);
    }
  }
}
