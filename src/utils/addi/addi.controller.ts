import { Body, Controller, Get, Post } from '@nestjs/common';
import { AddiService } from './addi.service';

@Controller('addi')
export class AddiController {
  constructor(private addiService: AddiService) {}

  @Get('auth')
  async addiAuth() {
    return await this.addiService.getAccessToken();
  }

  @Post('create-app')
  async createApplication(@Body() payload: any) {
    return await this.addiService.createOnlineLoanApplication(payload);
  }
}
