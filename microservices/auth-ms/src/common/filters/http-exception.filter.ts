//src/common/filters/http-exception.filter.ts

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let response: any = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: req.url,
    };

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      response = {
        ...(exception.getResponse() as object),
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: req.url,
      };
    } else if (exception instanceof Error) {
      response = {
        message: exception.message,
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: req.url,
      };
    }

    // Log para observabilidad tipado
    this.logger.error(
      `Exception at ${req.method} ${req.url} - body: ${JSON.stringify(req.body)}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    res.status(status).json(response);
  }
}
