import { Injectable, NotFoundException } from '@nestjs/common';
import { InlineProduct } from '../entities/inline-products.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateInlineProductDTO,
  UpdateInlineProductDTO,
} from '../dtos/inline-product.dto';
import { ProductVariantService } from 'src/products/services/product-variant.service';
import { SellService } from './sell.service';
import Decimal from 'decimal.js';

@Injectable()
export class InlineProductService {
  constructor(
    @InjectRepository(InlineProduct)
    private inlineProductRepository: Repository<InlineProduct>,
    private sellService: SellService,
    private productVariantService: ProductVariantService,
  ) {}

  findAll() {
    return this.inlineProductRepository.find();
  }

  async findOne(id: number) {
    const inlineProduct = await this.inlineProductRepository
      .createQueryBuilder('inlineProduct')
      .leftJoinAndSelect('inlineProduct.productVariant', 'productVariant')
      .leftJoinAndSelect('productVariant.product', 'product')
      .leftJoinAndSelect(
        'productVariant.variantAttributes',
        'variantAttributes',
      )
      .leftJoinAndSelect('variantAttributes.attribute', 'attribute')
      .leftJoinAndSelect('inlineProduct.sell', 'sell')
      .where('inlineProduct.id = :id', { id })
      .getOne();
    if (!inlineProduct) {
      throw new NotFoundException(
        `The Inline-Product with ID: ${id} was Not Found`,
      );
    }
    return inlineProduct;
  }

  async createEntity(payload: CreateInlineProductDTO) {
    const newInlineProduct = this.inlineProductRepository.create(payload);
    if (payload.sellId) {
      newInlineProduct.sell = await this.sellService.findOne(payload.sellId);
    }
    if (payload.productvariantId) {
      newInlineProduct.productVariant =
        await this.productVariantService.findOne(payload.productvariantId);
    }
    const unitPrice = new Decimal(newInlineProduct.productVariant.price);
    newInlineProduct.inlineTotal = unitPrice.mul(payload.quantity).toFixed(4);
    return await this.inlineProductRepository.save(newInlineProduct);
  }

  async updateEntity(id: number, payload: UpdateInlineProductDTO) {
    const inlineProduct = await this.inlineProductRepository.findOneBy({ id });
    if (!inlineProduct) {
      throw new NotFoundException(
        `The Inline-Product with ID: ${id} was Not Found`,
      );
    }
    this.inlineProductRepository.merge(inlineProduct, payload);
    return this.inlineProductRepository.save(inlineProduct);
  }

  async deleteEntity(id: number) {
    const exist = await this.inlineProductRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException(
        `The Inline-Product with ID: ${id} was Not Found`,
      );
    }
    return this.inlineProductRepository.softDelete(id);
  }

  async eliminateEntity(id: number) {
    const exist = await this.inlineProductRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException(
        `The Inline-Product with ID: ${id} was Not Found`,
      );
    }
    return this.inlineProductRepository.delete(id);
  }
}
