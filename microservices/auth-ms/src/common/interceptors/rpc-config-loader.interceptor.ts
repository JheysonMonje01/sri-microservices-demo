//src/common/interceptors/rpc-config-loader.interceptor.ts

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthConfigService } from '../../modules/auth/core/config/auth-config.service';

@Injectable()
export class RpcConfigLoaderInterceptor implements NestInterceptor {
  constructor(private readonly config: AuthConfigService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    // Precarga de config para TCP
    await this.config.get('jwt');
    await this.config.get('features');
    await this.config.get('seguridad');

    return next.handle();
  }
}
