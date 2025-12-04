//src/modules/auth/auth-config/auth-config.controller.ts
import {
  Controller,
  Get,
  Patch,
  Put,
  Param,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { AuthConfigGatewayService } from './auth-config.service';
import { Roles } from '../../../common/decorators/roles.decorator';

@Controller('auth/config')
export class AuthConfigController {
  constructor(private readonly configSrv: AuthConfigGatewayService) {}

  @Get(':key')
  @Roles('ADMIN')
  getConfig(@Param('key') key: string) {
    return this.configSrv.get(key);
  }

  @Patch(':key')
  @Roles('ADMIN')
  @UsePipes(new ValidationPipe({ whitelist: false }))
  patchConfig(
    @Param('key') key: string,
    @Body() body: Record<string, unknown>,
  ) {
    return this.configSrv.update(key, body);
  }

  @Put(':key')
  @Roles('ADMIN')
  @UsePipes(new ValidationPipe({ whitelist: false }))
  putConfig(
    @Param('key') key: string,
    @Body() body: Record<string, unknown>,
  ) {
    return this.configSrv.update(key, body);
  }
}
