// src/common/interfaces/http/login-request.interface.ts
import { Request } from 'express';

export interface LoginRequest extends Request {
  ip: string;
  headers: {
    'user-agent'?: string;
  };
}
