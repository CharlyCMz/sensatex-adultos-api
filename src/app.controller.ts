import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { CustomAuthGuard } from './auth/guards/custom-auth.guard';
import { Public } from './auth/decorators/public.decorator';

@UseGuards(CustomAuthGuard)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  getHello(): string {
    return this.appService.getHello();
  }
}
