import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { SellService } from '../services/sell.service';
import { AdminUpdateSellDTO, CreateSellDTO } from '../dtos/sell.dto';
import { PersonService } from 'src/users/services/person.service';
import { AddressService } from 'src/users/services/address.service';
import { InlineProductService } from '../services/inline-product.service';
import { WebhookDTO } from 'src/utils/mercadopago/dtos/webhook.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { CustomAuthGuard } from 'src/auth/guards/custom-auth.guard';

@UseGuards(CustomAuthGuard)
@Controller('sales')
export class SellController {
  constructor(
    private sellService: SellService,
    private personService: PersonService,
    private addressService: AddressService,
    private inlineProductService: InlineProductService,
  ) {}

  @Post()
  @Public()
  async createEntity(@Body() payload: CreateSellDTO) {
    let personId = await this.personService.findByDocumentNumber(
      payload.person.docTypeId,
      payload.person.document,
    );
    if (!personId) {
      const newPerson = await this.personService.createEntity(payload.person);
      personId = newPerson.id;
    }

    const shippingAddress = await this.addressService.createEntity({
      ...payload.person.address,
      personId,
    });

    const billingAddress = payload.billingAddress
      ? await this.addressService.createEntity({
          ...payload.billingAddress,
          personId,
        })
      : shippingAddress;

    let sell = await this.sellService.createEntity(
      personId,
      shippingAddress.id,
      payload.billingAddress ? billingAddress.id : undefined,
    );

    for (const inlineProduct of payload.inlineProducts) {
      await this.inlineProductService.createEntity({
        ...inlineProduct,
        sellId: sell.id,
      });
    }

    sell = await this.sellService.updateEntity(sell.id);
    return sell;
  }

  @Get()
  @Public()
  findAll() {
    return this.sellService.findAll();
  }

  @Get('latest')
  @Public()
  findLatest() {
    return this.sellService.findLatestSales();
  }

  @Get('monthly-sales')
  @Public()
  monthlySales() {
    return this.sellService.getMonthlySalesReport();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.sellService.findOne(id);
  }

  @Get('trackCode/:code')
  @Public()
  findOneByCode(@Param('code') code: string) {
    return this.sellService.findOneByCode(code);
  }

  @Post('webhook')
  @Public()
  webhookUpdate(@Body() payload: WebhookDTO) {
    if (payload.topic === 'payment' && payload.resource) {
      return this.sellService.updateWebhookResponse(payload.resource);
    }
    return { received: true };
  }

  @Put(':id')
  updateEntity(@Param('id') id: string, @Body() payload: AdminUpdateSellDTO) {
    return this.sellService.adminUpdateEntity(id, payload);
  }

  @Delete(':id')
  deleteEntity(@Param('id') id: string) {
    return this.sellService.deleteEntity(id);
  }

  @Delete('eliminate/:id')
  eliminateEntity(@Param('id') id: string) {
    return this.sellService.eliminateEntity(id);
  }
}
