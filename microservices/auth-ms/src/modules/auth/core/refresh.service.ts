import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../../common/database/prisma.service';
import { TokenUtil } from '../../../common/utils/token.util';
import { ConfigService } from '@nestjs/config';
import { SessionService } from './sessions/session.service';
import * as crypto from 'crypto';

@Injectable()
export class RefreshService {
  private tokenUtil: TokenUtil;

  constructor(
    private readonly prisma: PrismaService,
    private readonly sessions: SessionService,
    private readonly config: ConfigService,
  ) {
    this.tokenUtil = new TokenUtil(config);
  }

  // 🔐 Hash real usado en tu implementación anterior
  private hashRefreshToken(token: string): string {
    const pepper = this.config.get<string>('JWT_PEPPER') ?? '';
    return crypto.createHmac('sha256', pepper).update(token).digest('hex');
  }

  async refresh(refreshToken: string) {
    // Buscar sesión según tu lógica real
    const session = await this.prisma.sesion.findFirst({
      where: { 
        refreshTokenHash: this.hashRefreshToken(refreshToken), 
        revocada: false 
      },
      include: { usuario: true },
    });

    if (!session) throw new UnauthorizedException('Refresh token inválido');

    // Cargar roles reales
    const orgRoles = await this.prisma.usuarioOrganizacion.findMany({
      where: { usuarioId: session.usuarioId },
      include: { rol: true },
    });

    const roles = orgRoles.map((ur) => ur.rol.nombre);

    // Rotar refresh token
    const { token: newRefresh, hashed: newHash, expiresIn } =
      this.tokenUtil.createRefreshToken();

    await this.prisma.sesion.update({
      where: { id: session.id },
      data: {
        refreshTokenHash: newHash, 
        expiraEn: new Date(Date.now() + expiresIn * 1000),
      },
    });

    // Nuevo access token con roles actuales
    const { token: accessToken } = this.tokenUtil.createAccessToken({
      sub: session.usuarioId,
      email: session.usuario.email,
      roles,
    });

    return {
      access_token: accessToken,
      refresh_token: newRefresh,
    };
  }
}
