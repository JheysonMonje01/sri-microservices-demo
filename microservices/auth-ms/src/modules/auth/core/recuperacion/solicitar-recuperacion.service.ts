// src/modules/auth/core/recuperacion/solicitar-recuperacion.service.ts

import { Injectable } from '@nestjs/common';
import { RedisService } from '../../../../common/cache/redis.service';
import { PrismaService } from '../../../../common/database/prisma.service';
import { cryptoRandom, hmacSha256 } from '../../../../common/utils/crypto.util';
import { EmailService } from '../../../../common/email/mail.service';

@Injectable()
export class SolicitarRecuperacionService {
  constructor(
    private readonly redis: RedisService,
    private readonly prisma: PrismaService,
    private readonly emailSrv: EmailService,
  ) {}

  async solicitarRecuperacion(email: string) {
    const correo = email.trim().toLowerCase();

    // Buscar usuario sin revelar existencia
    const usuario = await this.prisma.user.findUnique({
      where: { email: correo },
      select: { id: true, nombre: true },
    });

    // Crear token seguro (NO se guarda en plano)
    const tokenRaw = cryptoRandom(48);
    const tokenHash = hmacSha256(tokenRaw, process.env.JWT_PEPPER ?? '');

    // Código de 6 dígitos
    const codigo6 = Math.floor(100000 + Math.random() * 900000).toString();

    // Guardar en Redis por 10 minutos
    await this.redis.set(
      `recuperacion:${correo}`,
      {
        tokenHash,
        codigo6,
      },
      600, // 10 minutos
    );

    // Enviar correo SOLO si el usuario existe
    if (usuario) {
      const nombre = usuario.nombre ?? 'Usuario';

      const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Recuperación de contraseña</h2>
          <p>Hola <strong>${nombre}</strong>,</p>
          <p>Hemos recibido una solicitud para restablecer tu contraseña.</p>
          <p>Tu código de verificación es:</p>
          <h1 style="font-size: 38px; color: #007bff;">${codigo6}</h1>

          <p>O si prefieres, puedes usar el siguiente enlace:</p>
          <a href="https://app.com/restablecer?token=${tokenRaw}"
             style="background: #007bff; color: white; padding: 10px 15px; 
                    text-decoration: none; border-radius: 6px;">
            Restablecer contraseña
          </a>

          <p style="margin-top: 20px; color: #555;">
            Este código y enlace caducan en <strong>10 minutos</strong>.
          </p>
        </div>
      `;

      await this.emailSrv.enviarCorreo(
        correo,
        'Código para recuperar tu contraseña',
        html,
      );
    }

    // Respuesta genérica para evitar revelación de emails
    return {
      message: 'Si el correo existe, hemos enviado instrucciones a su bandeja.',
    };
  }
}
