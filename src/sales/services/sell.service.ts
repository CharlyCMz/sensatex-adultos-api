import { Injectable, NotFoundException } from '@nestjs/common';
import { Sell } from '../entities/sell.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateSellDTO } from '../dtos/sell.dto';
import { PersonService } from 'src/users/services/person.service';
import { AddressService } from 'src/users/services/address.service';
import Decimal from 'decimal.js';
import { customAlphabet } from 'nanoid';
import { MercadopagoService } from 'src/utils/mercadopago/mercadopago.service';
import { MpPreferenceData } from 'src/utils/mercadopago/dtos/mp-order.dto';

const generateTrackingCode = customAlphabet('1234567890', 10);
@Injectable()
export class SellService {
  constructor(
    @InjectRepository(Sell)
    private sellRepository: Repository<Sell>,
    private personService: PersonService,
    private addressService: AddressService,
    private mercadoPagoService: MercadopagoService,
  ) {}

  findAll() {
    return this.sellRepository.find();
  }

  async findOne(id: string) {
    const sell = await this.sellRepository
      .createQueryBuilder('sell')
      .leftJoinAndSelect('sell.person', 'person')
      .leftJoinAndSelect('person.addresses', 'addresses')
      .leftJoinAndSelect('addresses.location', 'location')
      .leftJoinAndSelect('sell.inlineProducts', 'inlineProducts')
      .leftJoinAndSelect('inlineProducts.productVariant', 'productVariant')
      .leftJoinAndSelect('productVariant.product', 'product')
      .where('sell.id = :id', { id })
      .getOne();
    if (!sell) {
      throw new NotFoundException(`The Sell with ID: ${id} was Not Found`);
    }
    return sell;
  }

  async findOneNoDetails(id: string) {
    const sell = await this.sellRepository
      .createQueryBuilder('sell')
      .leftJoinAndSelect('sell.person', 'person')
      .leftJoinAndSelect('person.addresses', 'addresses')
      .leftJoinAndSelect('addresses.location', 'location')
      .where('sell.id = :id', { id })
      .getOne();
    if (!sell) {
      throw new NotFoundException(`The Sell with ID: ${id} was Not Found`);
    }
    return sell;
  }

  async createEntity(
    personId: string,
    addressId: string,
    billingAddressId?: string,
  ) {
    const newSell: Sell = new Sell();
    newSell.status = 'Pending';
    newSell.person = await this.personService.findOne(personId);
    newSell.shippingAddress =
      await this.addressService.findOneToString(addressId);
    if (billingAddressId) {
      newSell.billingAddress =
        await this.addressService.findOneToString(billingAddressId);
    } else {
      newSell.billingAddress = newSell.shippingAddress;
    }
    return await this.sellRepository.save(newSell);
  }

  async updateEntity(id: string, payload?: UpdateSellDTO) {
    const sell = await this.findOne(id);
    if (payload?.status) {
      sell.status = payload.status;
    }
    if (!sell) {
      throw new NotFoundException(`The Sell with ID: ${id} was Not Found`);
    }
    const shipping = new Decimal('8000');
    const purchase = sell.inlineProducts.reduce(
      (total, inlineProduct) =>
        total.plus(new Decimal(inlineProduct.inlineTotal)),
      new Decimal(0),
    );
    sell.shippingTotal = shipping.toFixed(4);
    sell.purchaseTotal = purchase.toFixed(4);
    sell.total = purchase.plus(shipping).toFixed(4);
    if (!sell.trackingCode) {
      sell.trackingCode = await this.trackingCodeHelper();
    }
    const mpPreferenceData = this.generateMpPreferenceData(sell);
    sell.paymentLink =
      await this.mercadoPagoService.createOrder(mpPreferenceData);
    await this.sellRepository.save(sell);
    return sell;
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

  //#region Helper Methods
  async trackingCodeHelper(): Promise<string> {
    let unique = false;
    let attempts = 0;

    while (!unique && attempts < 10) {
      const newCode = generateTrackingCode();
      const existing = await this.sellRepository.findOne({
        where: { trackingCode: newCode },
      });

      if (!existing) {
        unique = true;
        return newCode;
      }

      attempts++;
    }

    if (!unique) {
      const fallbackCode = generateTrackingCode();
      return `RETRY-CODE-${fallbackCode}`;
    } else {
      const crashCode = generateTrackingCode();
      return `CRASH-CODE-${crashCode}`;
    }
  }

  generateMpPreferenceData(sell: Sell): MpPreferenceData {
    const preferenceData: MpPreferenceData = {
      items: [],
      back_urls: {
        success: '',
        failure: '',
        pending: '',
      },
      auto_return: '',
      notification_url: '',
      external_reference: sell.id,
      payer: {
        email: sell.person.mail,
      },
    };

    for (const inlineProduct of sell.inlineProducts) {
      let unitPrice = 0;
      if (inlineProduct.productVariant.discountPrice) {
        unitPrice = new Decimal(
          inlineProduct.productVariant.discountPrice,
        ).toNumber();
      } else {
        unitPrice = new Decimal(inlineProduct.productVariant.price).toNumber();
      }
      preferenceData.items.push({
        id: inlineProduct.productVariant.id,
        title: inlineProduct.productVariant.product.name,
        currency_id: 'COP',
        quantity: inlineProduct.quantity,
        unit_price: unitPrice,
      });
    }
    preferenceData.items.push({
      id: 'shipping',
      title: 'Shipping Cost',
      currency_id: 'COP',
      quantity: 1,
      unit_price: new Decimal(sell.shippingTotal).toNumber(),
    });
    return preferenceData;
  }
}
