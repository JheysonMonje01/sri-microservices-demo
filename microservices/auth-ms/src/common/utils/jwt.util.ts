// src/common/utils/jwt.util.ts
import jwt, { SignOptions } from 'jsonwebtoken';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { ConfigService } from '@nestjs/config';

export class JwtUtil {
  constructor(private readonly config: ConfigService) {}

  private getSigningSecret(): string {
    // Usa el mismo secreto que el Gateway
    return this.config.get<string>('JWT_SECRET') ?? 'my_super_secret_key';
  }

  sign(payload: JwtPayload, expiresIn: string | number): string {
    const secret = this.getSigningSecret();

    const options: SignOptions = {
      expiresIn: expiresIn as SignOptions['expiresIn'],
    };

    // 🔹 Devuelve un JWT estándar (3 partes)
    return jwt.sign(payload as object, secret, options);
  }

  verify(token: string): JwtPayload {
    const secret = this.getSigningSecret();
    return jwt.verify(token, secret) as JwtPayload;
  }
}
