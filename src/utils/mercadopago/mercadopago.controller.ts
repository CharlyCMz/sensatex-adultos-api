import { Body, Controller, Post } from '@nestjs/common';
import { MercadopagoService } from './mercadopago.service';
import { MpPreferenceData } from './dtos/mp-order.dto';

@Controller('mercadopago')
export class MercadopagoController {
  constructor(private mercadopagoService: MercadopagoService) {}

  @Post('create-order')
  async createOrder(@Body() payload: MpPreferenceData) {
    return this.mercadopagoService.createOrder(payload);
  }
}
