//src/common/exceptions/gateway.exception.ts

import { HttpException, HttpStatus } from '@nestjs/common';

export class GatewayException extends HttpException {
  constructor(message: string, status: number = HttpStatus.BAD_GATEWAY) {
    super(message, status);
  }
}
