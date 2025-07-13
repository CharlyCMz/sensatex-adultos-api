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
import { MailerService } from 'src/utils/mailer/mailer.service';
import { ProductVariantService } from 'src/products/services/product-variant.service';

const generateTrackingCode = customAlphabet('1234567890', 10);
@Injectable()
export class SellService {
  constructor(
    @InjectRepository(Sell)
    private sellRepository: Repository<Sell>,
    private personService: PersonService,
    private addressService: AddressService,
    private productVariantService: ProductVariantService,
    private mercadoPagoService: MercadopagoService,
    private mailerService: MailerService,
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
      .leftJoinAndSelect('person.docType', 'docType')
      .leftJoinAndSelect('person.addresses', 'addresses')
      .leftJoinAndSelect('addresses.location', 'location')
      .where('sell.id = :id', { id })
      .getOne();
    if (!sell) {
      throw new NotFoundException(`The Sell with ID: ${id} was Not Found`);
    }
    return sell;
  }

  async findOneByCode(code: string) {
    const sell = await this.sellRepository
      .createQueryBuilder('sell')
      .leftJoinAndSelect('sell.person', 'person')
      .leftJoinAndSelect('person.addresses', 'addresses')
      .leftJoinAndSelect('addresses.location', 'location')
      .where('sell.trackingCode = :code', { code })
      .getOne();
    if (!sell) {
      throw new NotFoundException(`The Sell with Code: ${code} was Not Found`);
    }
    return sell;
  }

  async createEntity(
    personId: string,
    addressId: string,
    billingAddressId?: string,
  ) {
    const newSell: Sell = new Sell();
    newSell.status = 'pending';
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
    if (!sell) {
      throw new NotFoundException(`The Sell with ID: ${id} was Not Found`);
    }
    if (payload?.status) {
      sell.status = payload.status;
      if (sell.status === 'approved') {
        try {
          for (const inlineProduct of sell.inlineProducts) {
            await this.productVariantService.updateSales(
              inlineProduct.productVariant.id,
              inlineProduct.quantity,
            );
          }
          await this.mailerService.sendConfirmationEmail(
            sell.person.mail,
            sell.trackingCode,
            sell.total,
          );
        } catch (error) {
          console.error('Error sending confirmation email:', error);
        }
      }
    } else {
      const shipping = sell.shippingAddress.includes('Villamaría') || sell.shippingAddress.includes('Manizales') ? new Decimal('8000') : new Decimal('12000');
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
      console.log('Sell total:', sell.total);
      const mpPreferenceData = this.generateMpPreferenceData(sell);
      sell.paymentLink =
        await this.mercadoPagoService.createOrder(mpPreferenceData);
      await this.sellRepository.save(sell);
    }
    return sell;
  }

  async updateWebhookResponse(id: string) {
    const payment = await this.mercadoPagoService.webhookPayment(id);
    return this.webhookStatusUpdate(payment.externalReference, payment.status);
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
        success:
          'https://d1ce-2800-484-8f78-be00-8997-4c82-8ad6-a8f4.ngrok-free.app/sales/success',
        failure:
          'https://d1ce-2800-484-8f78-be00-8997-4c82-8ad6-a8f4.ngrok-free.app/sales/failure',
        pending:
          'https://d1ce-2800-484-8f78-be00-8997-4c82-8ad6-a8f4.ngrok-free.app/sales/pending',
      },
      auto_return: '',
      notification_url:
        'https://d1ce-2800-484-8f78-be00-8997-4c82-8ad6-a8f4.ngrok-free.app/sales/webhook',
      external_reference: sell.id,
      payer: {
        email: sell.person.mail,
      },
    };

    for (const inlineProduct of sell.inlineProducts) {
      let unitPrice = 0;
      if (inlineProduct.productVariant.discountPrice || inlineProduct.productVariant.discountPrice === '0') {
        unitPrice = new Decimal(
          inlineProduct.productVariant.discountPrice,
        ).toNumber();
      } else {
        console.log('Product Variant Price:', inlineProduct.productVariant.price);
        unitPrice = new Decimal(inlineProduct.productVariant.price).toNumber();
        console.log('Unit Price:', unitPrice);
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
    console.log('Preference Data:', preferenceData);
    return preferenceData;
  }

  async webhookStatusUpdate(id: string, status: string) {
    const sell = await this.findOneNoDetails(id);
    if (!sell) {
      throw new NotFoundException(`Sell with ID: ${id} was not found`);
    }
    sell.status = status;
    return await this.updateEntity(sell.id, {
      status: sell.status,
    });
  }
  //#endregion
}
