import { Injectable, NotFoundException } from '@nestjs/common';
import { Sell } from '../entities/sell.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSellDTO, UpdateSellDTO } from '../dtos/sell.dto';
import { PersonService } from 'src/users/services/person.service';
import { AddressService } from 'src/users/services/address.service';

@Injectable()
export class SellService {
  constructor(
    @InjectRepository(Sell)
    private sellRepository: Repository<Sell>,
    private personService: PersonService,
    private addressService: AddressService,
  ) {}

  findAll() {
    return this.sellRepository.find();
  }

  async findOne(id: string) {
    const sell = await this.sellRepository
      .createQueryBuilder('sell')
      .leftJoinAndSelect('sell.person', 'person')
      .leftJoinAndSelect('sell.inlineProducts', 'inlineProducts')
      .leftJoinAndSelect('inlineProducts.product', 'product')
      .where('sell.id = :id', { id })
      .getOne();
    if (!sell) {
      throw new NotFoundException(`The Sell with ID: ${id} was Not Found`);
    }
    return sell;
  }

  async createEntity(personId: string, addressId: string, billingAddressId?: string) {
    const newSell: Sell = new Sell();
    newSell.person = await this.personService.findOne(personId);
    newSell.shippingAddress = await this.addressService.findOneToString(addressId);
    if (billingAddressId) {
      newSell.billingAddress = await this.addressService.findOneToString(billingAddressId);
    }
    return await this.sellRepository.save(newSell);
  }

  async updateEndity(id: string, payload: UpdateSellDTO) {
    // const sell = await this.sellRepository.findOneBy({ id });
    // if (!sell) {
    //   throw new NotFoundException(`The Sell with ID: ${id} was Not Found`);
    // }
    // this.sellRepository.merge(sell, payload);
    // return this.sellRepository.save(sell);
  }

  async deleteEntity(id: string) {
    const exist = await this.sellRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException(`The Sell with ID: ${id} was Not Found`);
    }
    return this.sellRepository.softDelete(id);
  }

  async eliminateEntity(id: string) {
    const exist = await this.sellRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException(`The Sell with ID: ${id} was Not Found`);
    }
    return this.sellRepository.delete(id);
  }
}
