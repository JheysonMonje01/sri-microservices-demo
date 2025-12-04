import { Module } from '@nestjs/common';

// Controllers
import { AuthController } from './controllers/auth.controller';
import { AuthMessageController } from './auth.message.controller';
import { RecuperacionMessageController } from './controllers/recuperacion.controller';
import { AuthConfigMessageController } from './controllers/auth-config.message.controller';
import { AuditoriaMessageController } from './controllers/auditoria.message.controller';

// Core Services
import { AuthService } from './core/auth.service';
import { RegisterService } from './core/register.service';
import { LoginService } from './core/login.service';
import { RefreshService } from './core/refresh.service';
import { LogoutService } from './core/logout.service';
import { SessionService } from './core/sessions/session.service';

import { RefreshStrategy } from './strategies/refresh.strategy';
import { AccountLockService } from './core/security/account-lock.service';
import { IntentosLoginService } from './core/security/intentos-login.service';
import { ValidateTokenService } from './core/validate-token.service';

// Auditoría
import { AuditoriaService } from './core/auditoria/auditoria.service';
import { AuditoriaRepository } from './core/auditoria/auditoria.repository';

// Infraestructura
import { SecurityModule } from '../../common/security/security.module';
import { RedisModule } from '../../common/cache/redis.module';
import { PrismaService } from '../../common/database/prisma.service';
import { ConfigModule } from '@nestjs/config';

import { SolicitarRecuperacionService } from './core/recuperacion/solicitar-recuperacion.service';
import { VerificarRecuperacionService } from './core/recuperacion/verificar-recuperacion.service';
import { RestablecerContrasenaService } from './core/recuperacion/restablecer-contrasena.service';

import { EmailModule } from 'src/common/email/email.module';

import { AuthConfigService } from './core/config/auth-config.service';
import { AuthConfigCache } from './core/config/auth-config.cache';

// ⭐ GOOGLE OAUTH
import { GoogleAuthModule } from './core/google/google.module';
import { LoginGoogleService } from './core/google/login-google.service';

import { TokenUtil } from '../../common/utils/token.util';

@Module({
  imports: [
    SecurityModule,
    RedisModule,
    ConfigModule,
    EmailModule,

    // 👈 ***ESTO ERA LO QUE FALTABA***
    GoogleAuthModule,
  ],

  controllers: [
    AuthController,
    AuthMessageController,
    RecuperacionMessageController,
    AuthConfigMessageController,
    AuditoriaMessageController,
  ],

  providers: [
    AuthService,
    PrismaService,
    RefreshStrategy,

    // Config
    AuthConfigService,
    AuthConfigCache,

    RegisterService,
    LoginService,
    RefreshService,
    LogoutService,

    // 👈 Necesario para login con Google
    LoginGoogleService,

    SessionService,
    AccountLockService,
    IntentosLoginService,
    ValidateTokenService,

    TokenUtil,  // 👈 AGREGADO 

    SolicitarRecuperacionService,
    VerificarRecuperacionService,
    RestablecerContrasenaService,

    AuditoriaService,
    AuditoriaRepository,
  ],

  exports: [AuthService],
})
export class AuthModule {}
