import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { SellService } from '../services/sell.service';
import { CreateSellDTO, UpdateSellDTO } from '../dtos/sell.dto';
import { PersonService } from 'src/users/services/person.service';
import { AddressService } from 'src/users/services/address.service';
import { InlineProductService } from '../services/inline-product.service';

@Controller('sales')
export class SellController {
  constructor(
    private sellService: SellService,
    private personService: PersonService,
    private addressService: AddressService,
    private readonly inlineProductService: InlineProductService,
  ) {}

  @Post()
  async createEntity(@Body() payload: CreateSellDTO) {
    const person = await this.personService.createEntity(payload.person);
    const shippingAddress = await this.addressService.createEntity({
      ...payload.person.address,
      personId: person.id,
    });
    let billingAddress;
    if (payload.billingAddress) {
      billingAddress = await this.addressService.createEntity({
        ...payload.billingAddress,
        personId: person.id,
      });
    }
    let sell = await this.sellService.createEntity(
      person.id,
      shippingAddress.id,
      payload.status,
      payload.billingAddress ? billingAddress.id : undefined,
    );
    for (const inlineProduct of payload.inlineProducts) {
      const createdInlineProduct = await this.inlineProductService.createEntity({
        ...inlineProduct,
        sellId: sell.id,
      });
    }
    sell = await this.sellService.updateEntity(sell.id);
    return sell;
  }

  @Get()
  findAll() {
    return this.sellService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sellService.findOne(id);
  }

  @Put(':id')
  updateEntity(@Param('id') id: string, @Body() payload: UpdateSellDTO) {
    return this.sellService.updateEntity(id, payload);
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
