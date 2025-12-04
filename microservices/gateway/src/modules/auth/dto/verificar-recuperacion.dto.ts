//src/modules/auth/dto/verificar-recuperacion.dto.ts
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class VerificarRecuperacionDto {
  @IsEmail({}, { message: 'El correo electrónico no es válido.' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'El token es obligatorio.' })
  token!: string;

  @IsString()
  @Length(6, 6, { message: 'El código debe tener 6 dígitos.' })
  code!: string;
}
