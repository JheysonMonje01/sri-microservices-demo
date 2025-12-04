//src/common/exceptions/bad-request.exception.ts

import { BadRequestException as NestBadRequestException } from '@nestjs/common';

export class BadRequestException extends NestBadRequestException {
  constructor(message?: string | Record<string, any>) {
    super(typeof message === 'string' ? message : JSON.stringify(message));
  }
}

