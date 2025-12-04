//src/modules/auth/core/recuperacion/verificar-recuperacion.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RedisService } from '../../../../common/cache/redis.service';
import { hmacSha256, cryptoRandom } from '../../../../common/utils/crypto.util';

interface DatosRecuperacion {
  tokenHash: string;
  codigo6: string;
  // ip?: string;
  // userAgent?: string;
}

@Injectable()
export class VerificarRecuperacionService {
  constructor(private readonly redis: RedisService) {}

  async verificar(email: string, token: string, code: string) {
    const correo = email.trim().toLowerCase();

    const guardado = await this.redis.get<DatosRecuperacion>(
      `recuperacion:${correo}`,
    );
    if (!guardado) {
      throw new UnauthorizedException('Token o código inválido.');
    }

    // Validar código
    if (guardado.codigo6 !== code) {
      throw new UnauthorizedException('Código incorrecto.');
    }

    // Validar token
    const hash = hmacSha256(token, process.env.JWT_PEPPER ?? '');
    if (hash !== guardado.tokenHash) {
      throw new UnauthorizedException('Token inválido.');
    }

    // Crear RST (Recovery Session Token)
    const rstRaw = cryptoRandom(32);
    const rstHash = hmacSha256(rstRaw, process.env.JWT_PEPPER ?? '');

    await this.redis.set(`recuperacion-rst:${correo}`, rstHash, 300); // 5 min

    return {
      message: 'Código y token verificados correctamente.',
      rst: rstRaw,
    };
  }
}
