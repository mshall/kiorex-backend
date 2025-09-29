import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggingMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const { method, url, body } = req;
    const now = Date.now();

    // Add start time to request
    req['startTime'] = now;

    this.logger.log(
      `Incoming Request: ${method} ${url} - ${JSON.stringify(body)}`,
    );

    res.on('finish', () => {
      const delay = Date.now() - now;
      this.logger.log(
        `Outgoing Response: ${method} ${url} - ${res.statusCode} - ${delay}ms`,
      );
    });

    next();
  }
}
