//src/common/decorators/public.decorator.ts
import { SetMetadata } from '@nestjs/common';

/**
 * Decorador personalizado que marca un endpoint como público.
 * 
 * Esto permite omitir la autenticación en rutas específicas,
 * al verificarlo dentro de guards como JwtAuthGuard.
 * 
 * Ejemplo de uso:
 * 
 * ```ts
 * @Public()
 * @Post('register')
 * register(@Body() dto: RegisterDto) {
 *   return this.authService.register(dto);
 * }
 * ```
 */
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
