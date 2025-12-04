// ==========================================================
// gateway/src/modules/auth/auth.service.ts
// ==========================================================

import {
  Inject,
  Injectable,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

import { AUTH_COMMANDS } from '../../common/interfaces/messages.interface';
import { ServiceResponse } from '../../common/interfaces/service-response.interface';

import {
  ValidateTokenMsResponse,
  ValidateTokenGatewayResponse,
} from '../../common/interfaces/validate-token-response.interface';

// DTOs recuperación
import { SolicitarRecuperacionDto } from './dto/solicitar-recuperacion.dto';
import { VerificarRecuperacionDto } from './dto/verificar-recuperacion.dto';
import { RestablecerContrasenaDto } from './dto/restablecer-contrasena.dto';

// ==========================================================
// TIPADO SEGURO DEL ERROR RPC
// ==========================================================
interface RpcSerializedError {
  code?: string;
  statusCode?: number;
  message?: string | string[];
  error?: string | string[];
  response?: {
    statusCode?: number;
    message?: string | string[];
    error?: string | string[];
  };
}

// ==========================================================
// RESPUESTA DEL AUTH-MS
// ==========================================================
interface AuthMsLoginResponse {
  message?: string;
  access_token?: string;
  refresh_token?: string;
  session_id?: string;
  user?: {
    id: string;
    email: string;
    nombre: string;
    apellido: string;
    telefono: string | null;
    roles: string[];
  };
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject('AUTH_SERVICE')
    private readonly client: ClientProxy,
  ) {}

  // ==========================================================
  // REGISTER
  // ==========================================================
  register(dto: RegisterDto) {
    return this.sendCommand<AuthMsLoginResponse>(
      AUTH_COMMANDS.REGISTER,
      dto,
      'registro',
    );
  }

  // ==========================================================
  // LOGIN (usuario/contraseña)
  // ==========================================================
  login(dto: LoginDto & { ip?: string; userAgent?: string }) {
    return this.sendCommand<AuthMsLoginResponse>(
      AUTH_COMMANDS.LOGIN,
      dto,
      'inicio de sesión',
    );
  }

  // ==========================================================
  // LOGIN CON GOOGLE (id_token)
  // ==========================================================
  loginWithGoogle(idToken: string) {
    return this.sendCommand<AuthMsLoginResponse>(
      AUTH_COMMANDS.LOGIN_GOOGLE,
      { idToken },
      'login con Google',
    );
  }

  // ==========================================================
  // REFRESH
  // ==========================================================
  refresh(refreshToken: string) {
    return this.sendCommand<AuthMsLoginResponse>(
      AUTH_COMMANDS.REFRESH,
      { refreshToken },
      'refresh token',
    );
  }

  // ==========================================================
  // LOGOUT
  // ==========================================================
  logout(userId: string, sessionId: string) {
    return this.sendCommand(
      AUTH_COMMANDS.LOGOUT,
      { userId, sessionId },
      'logout',
    );
  }

  logoutAll(userId: string) {
    return this.sendCommand(
      AUTH_COMMANDS.LOGOUT_ALL,
      { userId },
      'logout-all',
    );
  }

  // ==========================================================
  // VALIDATE TOKEN (SIEMPRE VIA TCP)
  // ==========================================================
  async validateToken(
    token: string,
  ): Promise<ValidateTokenGatewayResponse> {
    const raw = await this.sendCommand<ValidateTokenMsResponse>(
      AUTH_COMMANDS.VALIDATE_TOKEN,
      { token },
      'validación de token',
    );

    return {
      message: raw.message ?? 'Token validado',
      data: {
        valid: raw.data?.valid ?? false,
        user: raw.data?.user ?? null,
      },
    };
  }

  // ==========================================================
  // 🔥 RECUPERACIÓN DE CONTRASEÑA POR TCP
  // ==========================================================
  solicitarRecuperacion(dto: SolicitarRecuperacionDto) {
    return this.sendCommand(
      AUTH_COMMANDS.RECUP_SOLICITAR,
      dto,
      'solicitar recuperación',
    );
  }

  verificarRecuperacion(dto: VerificarRecuperacionDto) {
    return this.sendCommand(
      AUTH_COMMANDS.RECUP_VERIFICAR,
      dto,
      'verificar recuperación',
    );
  }

  restablecerContrasena(dto: RestablecerContrasenaDto) {
    return this.sendCommand(
      AUTH_COMMANDS.RECUP_RESTABLECER,
      dto,
      'restablecer contraseña',
    );
  }

  // ==========================================================
  // MÉTODO GENÉRICO RPC
  // ==========================================================
  private async sendCommand<T>(
    pattern: Record<string, unknown>,
    payload: unknown,
    contexto: string,
  ): Promise<ServiceResponse<T>> {
    this.logger.debug(`📤 Enviando ${contexto} a auth-ms`, { payload });

    try {
      const result = await firstValueFrom(
        this.client.send<T>(pattern, payload).pipe(
          timeout(8000),
          catchError((err) => {
            throw err;
          }),
        ),
      );

      const message =
        (result as unknown as { message?: string }).message ??
        `Operación de ${contexto} exitosa`;

      return {
        message,
        data: result,
      };
    } catch (error) {
      this.handleRpcError(error, contexto);
    }
  }

  // ==========================================================
  // ERROR HANDLER
  // ==========================================================
  private handleRpcError(error: unknown, contexto: string): never {
    if (error instanceof TimeoutError) {
      throw new HttpException(
        `Tiempo de espera excedido (${contexto})`,
        HttpStatus.GATEWAY_TIMEOUT,
      );
    }

    const err = error as RpcSerializedError;

    if (err.code === 'ECONNREFUSED') {
      throw new HttpException(
        'El microservicio de autenticación no está disponible.',
        HttpStatus.BAD_GATEWAY,
      );
    }

    if (err.response?.statusCode) {
      const status = err.response.statusCode ?? 500;
      const raw = err.response.message ?? err.response.error ?? 'Error remoto';
      const message = Array.isArray(raw) ? raw.join(', ') : String(raw);
      throw new HttpException(message, status);
    }

    if (err.statusCode && err.message) {
      const raw = Array.isArray(err.message)
        ? err.message.join(', ')
        : String(err.message);
      throw new HttpException(raw, err.statusCode);
    }

    throw new HttpException(
      typeof err.message === 'string'
        ? err.message
        : `Error inesperado (${contexto})`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
