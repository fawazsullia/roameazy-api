import { Controller, Get } from '@nestjs/common';

@Controller('app')
export class AppController {
  constructor() { }

  @Get('live')
  live(): boolean {
    return true;
  }
}
