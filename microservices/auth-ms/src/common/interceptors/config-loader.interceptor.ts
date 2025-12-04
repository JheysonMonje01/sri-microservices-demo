//src/common/interceptors/config-loader.interceptor.ts

import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthConfigService } from '../../modules/auth/core/config/auth-config.service';

@Injectable()
export class ConfigLoaderInterceptor implements NestInterceptor {
  constructor(private readonly config: AuthConfigService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    await this.config.get('jwt');
    await this.config.get('features');
    return next.handle();
  }
}
