//src/modules/auth/dto/restablecer-contraseña.dto.ts

import { IsEmail, IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class RestablecerContrasenaDto {
  @IsEmail({}, { message: 'Correo inválido.' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'El token RST es obligatorio.' })
  rst!: string;

  @IsString()
  @MinLength(8, { message: 'La nueva contraseña debe tener al menos 8 caracteres.' })
  @Matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_]).+$/, {
    message: 'La contraseña debe contener mayúscula, número y un símbolo.',
  })
  nuevaContrasena!: string;
}
