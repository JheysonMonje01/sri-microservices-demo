// src/common/interfaces/user.interface.ts

export interface IUser {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  telefono?: string | null;
  activo: boolean;
  metadata?: Record<string, any>;
  roles: string[];  // ✔️ ahora siempre un arreglo
}
