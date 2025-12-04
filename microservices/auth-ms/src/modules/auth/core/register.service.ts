//src/modules/auth/core/register.service.ts

import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../../common/database/prisma.service';
import { PasswordService } from '../../../common/security/password.service';
import { RegisterDto } from '../dto/register.dto';

@Injectable()
export class RegisterService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
  ) {}

  async register(dto: RegisterDto) {
    const normalizedEmail = dto.email.trim().toLowerCase();

    const exists = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (exists) {
      throw new ConflictException(
        `El correo '${normalizedEmail}' ya está registrado.`,
      );
    }

    const hashedPassword = await this.passwordService.hashPassword(dto.password);

    const { user } = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: normalizedEmail,
          password: hashedPassword,
          nombre: dto.nombre,
          apellido: dto.apellido,
          telefono: dto.telefono,
          activo: true,
          metadata: dto.metadata ?? {},
        },
      });

      const org = await tx.organizacion.create({
        data: {
          nombre: `${user.nombre} ${user.apellido}`,
          tipo: 'PERSONAL',
          activo: true,
        },
      });

      const role = await tx.rol.create({
        data: {
          nombre: 'cliente_comun',
          descripcion: 'Usuario estándar del sistema',
          orgId: org.id,
        },
      });

      await tx.usuarioOrganizacion.create({
        data: {
          usuarioId: user.id,
          orgId: org.id,
          rolId: role.id,
        },
      });

      return { user };
    });

    return {
      message: 'Registro exitoso',
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        apellido: user.apellido,
        telefono: user.telefono,
        roles: ['cliente_comun'],
      },
    };
  }
}
