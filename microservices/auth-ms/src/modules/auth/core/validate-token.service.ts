//src/modules/auth/core/validate-token.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { JwtPayload } from '../../../common/interfaces/jwt-payload.interface';

@Injectable()
export class ValidateTokenService {
  constructor(private readonly jwt: JwtService) {}

  validateToken(token: string) {
    try {
      const decoded = this.jwt.verify<JwtPayload>(token);

      return {
        valid: true,
        user: {
          id: decoded.sub,
          email: decoded.email,
          roles: decoded.roles,
        },
      };
    } catch {
      return {
        valid: false,
        user: null,
        message: 'Token inválido',
      };
    }
  }
}
