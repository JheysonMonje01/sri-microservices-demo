//src/common/interfaces/login-response.interface.ts
import { User } from '@prisma/client';

export interface LoginResponse {
  message: string;
  access_token: string;
  user: Pick<User, 'id' | 'email' | 'nombre' | 'apellido' | 'telefono'> & {
    roles: string[];
  };
}
