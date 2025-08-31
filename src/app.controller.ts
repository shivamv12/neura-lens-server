import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import type { ServerStatus } from './common/interfaces/server-status.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getServerStatus(): ServerStatus {
    return this.appService.getServerStatus();
  }
}
