//src/modules/auth/core/google/google.module.ts
import { Module } from '@nestjs/common';
import { GoogleAuthMsService } from './google-auth-ms.service';

@Module({
  providers: [GoogleAuthMsService],
  exports: [GoogleAuthMsService],
})
export class GoogleAuthModule {}
