//src/common/filters/rpc-exception.filter.ts
import {
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, of } from 'rxjs';

interface GenericErrorShape {
  statusCode?: number;
  message?: string | string[];
  error?: string | string[];
}

@Catch()
export class RpcExceptionFilter {
  private readonly logger = new Logger(RpcExceptionFilter.name);

  catch(exception: unknown, _host: ArgumentsHost): Observable<any> {
    this.logger.error('⚠️ Excepción en AUTH-MS:', exception);

    //
    // ===============================
    //   1) HttpException normal
    // ===============================
    //
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse();

      let msg = 'Error desconocido';

      if (typeof response === 'string') {
        msg = response;
      } else if (
        typeof response === 'object' &&
        response !== null
      ) {
        const obj = response as GenericErrorShape;

        if (Array.isArray(obj.message)) {
          msg = obj.message.join(', ');
        } else if (typeof obj.message === 'string') {
          msg = obj.message;
        } else if (typeof obj.error === 'string') {
          msg = obj.error;
        }
      }

      return of({
        statusCode: status,
        message: msg,
        error: 'HttpException'
      });
    }

    //
    // ===============================
    //   2) RpcException
    // ===============================
    //
    if (exception instanceof RpcException) {
      const error = exception.getError();

      if (typeof error === 'object' && error !== null) {
        const err = error as GenericErrorShape;

        const rawMsg =
          err.message ??
          err.error ??
          'Error en RPC';

        const msg = Array.isArray(rawMsg)
          ? rawMsg.join(', ')
          : String(rawMsg);

        return of({
          statusCode: err.statusCode ?? 500,
          message: msg,
          error: 'RpcException',
        });
      }

      return of({
        statusCode: 500,
        message: String(error),
        error: 'RpcException',
      });
    }

    //
    // ===============================
    //   3) Error desconocido
    // ===============================
    //
    return of({
      statusCode: 500,
      message:
        exception instanceof Error
          ? exception.message
          : 'Error interno en AUTH-MS',
      error: 'Unknown',
    });
  }
}
