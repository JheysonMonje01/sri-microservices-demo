//src/modules/auth/dto/logout.dto.ts

import { IsOptional, IsString } from 'class-validator';

export class LogoutDto {
  @IsOptional()
  @IsString()
  session_id?: string;
}
