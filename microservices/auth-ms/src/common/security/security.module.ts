//src/common/security/security.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PasswordService } from './password.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'supersecreto123',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [PasswordService],
  exports: [PasswordService, JwtModule],
})
export class SecurityModule {}
