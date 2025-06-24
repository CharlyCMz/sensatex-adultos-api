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
    private inlineProductService: InlineProductService,
  ) {}

  @Post()
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
