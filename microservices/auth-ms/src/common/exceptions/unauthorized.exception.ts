//src/common/exceptions/unautorized.exception.ts


import { UnauthorizedException as NestUnauthorized } from '@nestjs/common';

export class UnauthorizedException extends NestUnauthorized {
  constructor(message = 'Unauthorized') {
    super(message);
  }
}
