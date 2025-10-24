import { Injectable, NotFoundException } from '@nestjs/common';
import { Sell, SellStatus } from '../entities/sell.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminUpdateSellDTO, UpdateSellDTO } from '../dtos/sell.dto';
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
    return this.sellRepository.find({
      relations: ['person'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  findLatestSales() {
    return this.sellRepository.find({
      order: {
        createdAt: 'DESC',
      },
      take: 5,
    });
  }

  async findOne(id: string) {
    const sell = await this.sellRepository
      .createQueryBuilder('sell')
      .leftJoinAndSelect('sell.person', 'person')
      .leftJoinAndSelect('person.docType', 'docType')
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
      .leftJoinAndSelect('sell.inlineProducts', 'inlineProducts')
      .leftJoinAndSelect('inlineProducts.productVariant', 'productVariant')
      .leftJoinAndSelect('productVariant.images', 'images')
      .leftJoinAndSelect('productVariant.product', 'product')
      .leftJoinAndSelect('person.addresses', 'addresses')
      .leftJoinAndSelect('addresses.location', 'location')
      .where('sell.trackingCode = :code', { code })
      .getOne();
    if (!sell) {
      throw new NotFoundException(`The Sell with Code: ${code} was Not Found`);
    }
    return sell;
  }

  async getMonthlySalesReport() {
    const result = await this.sellRepository
      .createQueryBuilder('sell')
      .select(
        "TO_CHAR(sell.created_at, 'TMMonth-YYYY', 'lc_time=es_ES.utf8')",
        'month',
      ) // Nombre del mes + año en español
      .addSelect('SUM(sell.total)::text', 'total') // Total vendido (como string)
      .addSelect('COUNT(sell.id)', 'count') // Número de ventas
      .where("sell.created_at >= NOW() - INTERVAL '6 months'")
      .groupBy("TO_CHAR(sell.created_at, 'TMMonth-YYYY', 'lc_time=es_ES.utf8')")
      .orderBy('MIN(sell.created_at)', 'ASC')
      .getRawMany();

    // Limpieza de formato y capitalización
    return result.map((r) => ({
      month: r.month
        .trim()
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase()), // Capitaliza el mes
      total: r.total,
      count: parseInt(r.count, 10),
    }));
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
      if (sell.status === SellStatus.SUCCESS) {
        try {
          for (const inlineProduct of sell.inlineProducts) {
            await this.productVariantService.updateSales(
              inlineProduct.productVariant.id,
              inlineProduct.quantity,
            );
          }
          await this.mailerService.sendConfirmationEmail(
            sell.person.name,
            sell.person.mail,
            'Confirmación de Compra',
            sell,
          );
          await this.mailerService.sendConfirmationEmail(
            'Sandra',
            'sensatexgroupsas@gmail.com',
            'Se ha realizado una Compra',
            sell,
          );
        } catch (error) {
          console.error('Error sending confirmation email:', error);
        }
      }
    } else {
      const shipping =
        sell.shippingAddress.includes('Villamaría') ||
        sell.shippingAddress.includes('Manizales')
          ? new Decimal('8000')
          : new Decimal('16000');
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
    }
    return sell;
  }

  async adminUpdateEntity(id: string, payload: AdminUpdateSellDTO) {
    const sell = await this.sellRepository.findOneBy({ id });
    if (!sell) {
      throw new NotFoundException(`The Sell with ID: ${id} was Not Found`);
    }
    this.sellRepository.merge(sell, payload);
    if (payload.status === SellStatus.SENT) {
      await this.mailerService.sendConfirmationEmail(
        sell.person.name,
        sell.person.mail,
        'Tu pedido ha sido enviado',
        sell,
      );
    }
    return await this.sellRepository.save(sell);
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
        success: `https://sensatexadultos.com/purchase-status/success/${sell.id}`,
        failure: `https://sensatexadultos.com/purchase-status/failed/${sell.id}`,
        pending: `https://sensatexadultos.com/purchase-status/processing/${sell.id}`,
      },
      auto_return: '',
      notification_url: 'https://sensatexadultos.com/api/sales/webhook',
      external_reference: sell.id,
      payer: {
        email: sell.person.mail,
      },
    };

    for (const inlineProduct of sell.inlineProducts) {
      let unitPrice = 0;
      if (
        inlineProduct.productVariant.discountPrice &&
        inlineProduct.productVariant.discountPrice != '0.0000'
      ) {
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

  async webhookStatusUpdate(id: string, status: string) {
    const sell = await this.findOneNoDetails(id);
    if (!sell) {
      throw new NotFoundException(`Sell with ID: ${id} was not found`);
    }
    switch (status) {
      case 'approved':
        sell.status = 'success';
        await this.sellRepository.save(sell);
        break;
      case 'rejected':
        sell.status = 'failed';
        await this.sellRepository.save(sell);
        break;
      default:
        sell.status = 'processing';
        await this.sellRepository.save(sell);
        break;
    }

    return await this.updateEntity(sell.id, {
      status: sell.status,
    });
  }
  //#endregion
}
