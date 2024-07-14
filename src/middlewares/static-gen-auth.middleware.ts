import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';
import baseConfig from 'src/configs/base.config';

@Injectable()
export class StaticGenAuth implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const requestToken = request.headers['authorization'];
    if(!requestToken) {
      response.status(401).send('Unauthorized');
      return;
    }
    const splitToken = requestToken.split(' ');
    if(splitToken.length !== 2) {
      response.status(401).send('Unauthorized');
      return;
    }
    if(splitToken[1] !== baseConfig().STATIC_GEN_AUTH_TOKEN) {
      response.status(401).send('Unauthorized');
      return;
    }
    next();
  }
}