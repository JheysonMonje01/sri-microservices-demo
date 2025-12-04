// src/modules/auth/auth-config.message.controller.ts

import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { AUTH_CONFIG_COMMANDS } from '../../../common/interfaces/messages.interface';
import { AuthConfigService } from '../core/config/auth-config.service';

// 🔥 Tipo seguro para evitar el error de UpdateResult no nombrable
interface UpdateConfigResponse<T = unknown> {
  message: string;
  key: string;
  value: T;
}

@Controller()
export class AuthConfigMessageController {
  constructor(private readonly config: AuthConfigService) {}

  @MessagePattern(AUTH_CONFIG_COMMANDS.GET)
  async getConfig(@Payload() data: { key: string }): Promise<any> {
    return this.config.get(data.key);
  }

  @MessagePattern(AUTH_CONFIG_COMMANDS.UPDATE)
  async updateConfig(
    @Payload() data: { key: string; value: unknown },
  ): Promise<UpdateConfigResponse> {
    return this.config.update(data.key, data.value);
  }
}
