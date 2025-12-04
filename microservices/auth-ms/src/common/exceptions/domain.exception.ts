//src/common/exceptions/domain.exception.ts

import { HttpException, HttpStatus } from '@nestjs/common';

export class DomainException extends HttpException {
  constructor(message: string, status = HttpStatus.UNPROCESSABLE_ENTITY) {
    super({ error: message }, status);
  }
}

