import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductVariant } from '../entities/product-variant.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import {
  CreateProductVariantDTO,
  UpdateProductVariantDTO,
} from '../dtos/product-variant.dto';
import { ProductService } from './product.service';
import { VariantAttribute } from '../entities/variant-attribute.entity';

@Injectable()
export class ProductVariantService {
  constructor(
    @InjectRepository(ProductVariant)
    private productVariantRepository: Repository<ProductVariant>,
    @InjectRepository(VariantAttribute)
    private variantAttributeRepository: Repository<VariantAttribute>,
    private productService: ProductService,
  ) {}

  async findAll() {
    //TODO: Implement pagination and filtering if needed
    return await this.productVariantRepository.find({
      relations: { product: { labels: { subCategory: { category: true } } } },
    });
  }

  async findOne(id: string) {
    const productVariant = await this.productVariantRepository
      .createQueryBuilder('productVariant')
      .leftJoinAndSelect('productVariant.product', 'product')
      .leftJoinAndSelect('productVariant.images', 'images')
      .leftJoinAndSelect(
        'productVariant.variantsAttributes',
        'variantsAttributes',
      )
      .leftJoinAndSelect('variantsAttributes.attribute', 'attribute')
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
    console.log('Creating Product Variant with payload:', payload);
    if (payload.variantAttributeIds && payload.variantAttributeIds.length > 0) {
      const variants = await this.variantAttributeRepository.findBy({
        id: In(payload.variantAttributeIds),
      });
      newProductVariant.variantsAttributes = variants;
    }
    return await this.productVariantRepository.save(newProductVariant);
  }

  //TODO: Update logic depending on Admin panel requirements
  async updateEntity(id: string, payload: UpdateProductVariantDTO) {
    const productVariant = await this.productVariantRepository.findOneBy({
      id,
    });
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

  //#region Variant Management
  async removeVariantFromProduct(productId: string, variantId: string) {
    const productVariant = await this.productVariantRepository.findOne({
      where: { id: productId },
      relations: ['variantsAttributes'],
    });
    if (!productVariant) {
      throw new NotFoundException(
        `The Product-Variant with ID: ${productId} was Not Found`,
      );
    }
    const variant = await this.variantAttributeRepository.findOneBy({
      id: variantId,
    });
    if (!variant) {
      throw new NotFoundException(
        `The Variant with ID: ${variantId} was Not Found`,
      );
    }
    productVariant.variantsAttributes =
      productVariant.variantsAttributes.filter((l) => l.id !== variantId);
    return this.productVariantRepository.save(productVariant);
  }

  async addVariantToProduct(productId: string, variantId: string) {
    const productVariant = await this.productVariantRepository.findOne({
      where: { id: productId },
      relations: ['variantsAttributes'],
    });
    if (!productVariant) {
      throw new NotFoundException(
        `The Product-Variant with ID: ${productId} was Not Found`,
      );
    }
    const variant = await this.variantAttributeRepository.findOneBy({
      id: variantId,
    });
    if (!variant) {
      throw new NotFoundException(
        `The Variant with ID: ${variantId} was Not Found`,
      );
    }
    if (productVariant.variantsAttributes.some((l) => l.id === variantId)) {
      throw new BadRequestException(
        `The Variant with ID: ${variantId} is already associated with this Product`,
      );
    }
    productVariant.variantsAttributes.push(variant);
    return this.productVariantRepository.save(productVariant);
  }
  //#endregion
}
