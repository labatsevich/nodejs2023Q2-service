import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { CustomLogger } from '../../logger/custom-logger.service';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly logger: CustomLogger,
    private readonly httpAdapterHost: HttpAdapterHost,
  ) {}
  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const context = host.switchToHttp();
    const req = context.getRequest<Request>();

    const { method, body, query, originalUrl } = req;

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(req),
      message,
    };

    httpAdapter.reply(context.getResponse(), responseBody, httpStatus);

    const errorLog = `Method: ${method}, url: ${originalUrl}, query: ${query}, body: ${JSON.stringify(
      body,
    )}`;

    this.logger.error(JSON.stringify(errorLog));
  }
}
