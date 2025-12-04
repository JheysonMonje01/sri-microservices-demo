// src/common/interfaces/rpc-error.interface.ts

/**
 * Tipado para errores enviados por microservicios.
 */
export interface RpcError {
  code?: string; // ECONNREFUSED, ETIMEDOUT, etc.

  response?: {
    message?: string | string[];
    statusCode?: number;
  };

  message?: string;
  stack?: string;

  error?: {
    message?: string | string[];
    statusCode?: number;
  };
}
