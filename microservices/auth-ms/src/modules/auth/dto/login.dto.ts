// src/modules/auth/dto/login.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
} from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

/**
 * DTO: LoginDto
 * Define y valida los datos de entrada del endpoint /auth/login.
 * 
 * Nota: ip y userAgent se inyectan en el controlador, no vienen del cliente.
 */
export class LoginDto {
  @ApiProperty({
    example: 'usuario@dominio.com',
    description: 'Correo electrónico registrado del usuario',
  })
  @IsEmail({}, { message: 'El correo electrónico no tiene un formato válido' })
  @Transform(({ value }: TransformFnParams): string => {
    if (typeof value === 'string') {
      return value.trim().toLowerCase();
    }
    return '';
  })
  email!: string;

  @ApiProperty({
    example: 'Contraseña123*',
    description:
      'Contraseña del usuario. Debe tener mínimo 8 caracteres, incluyendo mayúscula, minúscula y número.',
  })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La contraseña no puede estar vacía' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @MaxLength(64, { message: 'La contraseña no puede superar los 64 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message:
      'La contraseña debe contener al menos una letra mayúscula, una letra minúscula y un número',
  })
  password!: string;

  @ApiProperty({
    required: false,
    example: 'web',
    description: 'Origen de la solicitud (ejemplo: web, mobile, api-client).',
  })
  @IsOptional()
  @IsString({ message: 'El origen debe ser una cadena de texto' })
  @Transform(({ value }: TransformFnParams): string => {
    if (typeof value === 'string') {
      const trimmed = value.trim().toLowerCase();
      return trimmed.length > 0 ? trimmed : 'web';
    }
    return 'web';
  })
  origin?: string;

  // Estos campos NO los envía el cliente; los setea el controlador (req.ip, user-agent)
  @IsOptional()
  @IsString()
  ip?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;
}
