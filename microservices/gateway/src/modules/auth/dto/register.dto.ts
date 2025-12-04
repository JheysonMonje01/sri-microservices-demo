// src/modules/auth/dto/register.dto.ts
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
  MaxLength,
  IsObject,
} from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'El correo electrónico no es válido.' })
  email!: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  @MaxLength(32, { message: 'La contraseña no debe exceder los 32 caracteres.' })
  @Matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_]).+$/, {
    message:
      'La contraseña debe contener al menos una mayúscula, un número y un símbolo especial.',
  })
  password!: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  nombre!: string;

  @IsString()
  @IsNotEmpty({ message: 'El apellido es obligatorio.' })
  apellido!: string;

  @IsString()
  @Matches(/^(\+593|0)[0-9]{9}$/, {
    message:
      'El número de teléfono debe tener formato +593xxxxxxxxx o 09xxxxxxxx.',
  })
  telefono!: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
