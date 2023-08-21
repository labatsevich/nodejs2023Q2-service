import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { CustomLogger } from '../../logger/custom-logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: CustomLogger) {}
  use(req: Request, res: Response, next: NextFunction) {
    const { baseUrl, method, query, body } = req;

    res.on('finish', () => {
      const { statusCode } = res;

      const message = `Status code: ${statusCode}, method: ${method}, url:${baseUrl}, query: ${JSON.stringify(
        query,
      )}, body: ${JSON.stringify(body)}`;

      /*if (statusCode >= 400) {
        return this.logger.warn(message, 'HTTP');
      }

      if (statusCode >= 500) {
        return this.logger.error(message, 'no-trace', 'HTTP');
      }*/

      if (res.statusCode < 400) {
        return this.logger.log(message);
      }
    });

    next();
  }
}
