//src/modules/auth/google/google.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { GoogleController } from './google.controller';
import { GoogleAuthService } from './google.service';
import { AuthModule } from '../auth.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),  // ✔ CORRECCIÓN DEFINITIVA
  ],
  controllers: [GoogleController],
  providers: [GoogleAuthService],
  exports: [GoogleAuthService],
})
export class GoogleAuthModule {}
