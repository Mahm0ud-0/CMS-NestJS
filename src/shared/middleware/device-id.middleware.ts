import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

@Injectable()
export class DeviceIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (!req.cookies?.deviceId) {
      const deviceId = randomUUID();
      res.cookie('deviceId', deviceId, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
      });
      req.cookies.deviceId = deviceId; // set for the current request
    }
    next();
  }
}
