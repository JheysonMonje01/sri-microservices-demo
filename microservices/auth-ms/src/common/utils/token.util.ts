// src/common/utils/token.util.ts
import { ConfigService } from '@nestjs/config';
import { JwtUtil } from './jwt.util';
import { cryptoRandom, hmacSha256 } from './crypto.util';
import { TokenResponse } from '../interfaces/token-response.interface';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

export class TokenUtil {
  private jwtUtil: JwtUtil;

  constructor(private readonly config: ConfigService) {
    this.jwtUtil = new JwtUtil(config);
  }

  createAccessToken(payload: JwtPayload): { token: string; expiresIn: number } {
    const expiresIn = this.config.get<number>('TOKEN_ACCESS_SECONDS', 900);
    const token = this.jwtUtil.sign(payload, expiresIn);
    return { token, expiresIn };
  }

  createRefreshToken(): { token: string; hashed: string; expiresIn: number } {
    const raw = cryptoRandom(48);
    const pepper = this.config.get<string>('JWT_PEPPER') ?? '';
    const hashed = hmacSha256(raw, pepper);
    const expiresIn = this.config.get<number>('TOKEN_REFRESH_SECONDS', 60 * 60 * 24 * 30);
    return { token: raw, hashed, expiresIn };
  }

  createTokenResponse(payload: JwtPayload): TokenResponse {
    const acc = this.createAccessToken(payload);
    const ref = this.createRefreshToken();
    return {
      accessToken: acc.token,
      refreshToken: ref.token,
      expiresIn: acc.expiresIn,
    };
  }
}
