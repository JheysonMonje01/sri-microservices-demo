// src/modules/auth/dto/logout-all.dto.ts
import { IsString, IsArray } from 'class-validator';

export class LogoutAllDto {
  @IsString()
  userId!: string;

  @IsArray()
  sessions!: string[];
}
