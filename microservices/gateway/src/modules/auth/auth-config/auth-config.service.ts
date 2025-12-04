//src/modules/auth/auth-config/auth-config.service.ts

import { Inject, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { AUTH_CONFIG_COMMANDS } from '../../../common/interfaces/messages.interface';

@Injectable()
export class AuthConfigGatewayService {
  constructor(
    @Inject('AUTH_CONFIG_SERVICE')
    private readonly client: ClientProxy,
  ) {}

  async get(key: string): Promise<any> {
    return this.send(AUTH_CONFIG_COMMANDS.GET, { key });
  }

  async update(key: string, value: unknown): Promise<any> {
    return this.send(AUTH_CONFIG_COMMANDS.UPDATE, { key, value });
  }

  private async send(cmd: any, payload: any): Promise<any> {
    try {
      return await firstValueFrom(
        this.client.send(cmd, payload).pipe(
          timeout(7000),
          catchError((err) => {
            throw err;
          }),
        ),
      );
    } catch (error) {
      type RpcFail = {
        message?: string;
        response?: { statusCode?: number };
      };

      const e = error as RpcFail;

      if (error instanceof TimeoutError) {
        throw new HttpException(
          'Timeout comunicando con auth-ms',
          HttpStatus.GATEWAY_TIMEOUT,
        );
      }

      throw new HttpException(
        e.message ?? 'Error remoto',
        e.response?.statusCode ?? HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
