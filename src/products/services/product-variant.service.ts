import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductVariant } from '../entities/product-variant.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateProductVariantDTO,
  UpdateProductVariantDTO,
} from '../dtos/product-variant.dto';
import { VariantAttributeService } from './variant-attribute.service';
import { ProductService } from './product.service';

@Injectable()
export class ProductVariantService {
  constructor(
    @InjectRepository(ProductVariant)
    private productVariantRepository: Repository<ProductVariant>,
    private variantAttributeService: VariantAttributeService,
    private productService: ProductService,
  ) {}

  findAll() {
    //TODO: Implement pagination and filtering if needed
    return this.productVariantRepository.find({
      relations: ['labels', 'categories'], // Confirm the relations are working as expected
    });
  }

  async findOne(id: string) {
    const productVariant = await this.productVariantRepository
      .createQueryBuilder('productVariant')
      .leftJoinAndSelect('productVariant.product', 'product')
      .leftJoinAndSelect('productVariant.images', 'images')
      .leftJoinAndSelect(
        'productVariant.variantAttributes',
        'variantAttributes',
      )
      .leftJoinAndSelect('variantAttributes.attribute', 'attribute')
      .where('productVariant.id = :id', { id })
      .getOne();
    if (!productVariant) {
      throw new NotFoundException(
        `The Product-Variant with ID: ${id} was Not Found`,
      );
    }
    return productVariant;
  }

  async createEntity(payload: CreateProductVariantDTO) {
    const newProductVariant = this.productVariantRepository.create(payload);
    if (payload.productId) {
      const product = await this.productService.findOne(payload.productId);
      newProductVariant.product = product;
    }
    return await this.productVariantRepository.save(payload);
  }

  //TODO: Update logic depending on Admin panel requirements
  async updateEndity(id: string, payload: UpdateProductVariantDTO) {
    const productVariant = await this.productVariantRepository.findOneBy({ id });
    if (!productVariant) {
      throw new NotFoundException(
        `The Product-Variant with ID: ${id} was Not Found`,
      );
    }
    this.productVariantRepository.merge(productVariant, payload);
    return this.productVariantRepository.save(productVariant);
  }

  async deleteEntity(id: string) {
    const exist = await this.productVariantRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException(
        `The Product-Variant with ID: ${id} was Not Found`,
      );
    }
    return this.productVariantRepository.softDelete(id);
  }

  async eliminateEntity(id: string) {
    const exist = await this.productVariantRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException(
        `The Product-Variant with ID: ${id} was Not Found`,
      );
    }
    return this.productVariantRepository.delete(id);
  }
}
