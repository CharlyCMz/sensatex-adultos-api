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
import { ImageService } from './image.service';

@Injectable()
export class ProductVariantService {
  constructor(
    @InjectRepository(ProductVariant)
    private productVariantRepository: Repository<ProductVariant>,
    @InjectRepository(VariantAttribute)
    private variantAttributeRepository: Repository<VariantAttribute>,
    private productService: ProductService,
    private imageService: ImageService,
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
      .leftJoinAndSelect('product.subCategories', 'subCategories')
      .leftJoinAndSelect('subCategories.category', 'category')
      .leftJoinAndSelect('productVariant.images', 'images')
      .leftJoinAndSelect(
        'productVariant.variantsAttributes',
        'variantsAttributes',
      )
      .leftJoinAndSelect('variantsAttributes.attribute', 'attribute')
      .where('productVariant.id = :id', { id })
      .addOrderBy('images.createdAt', 'ASC')
      .getOne();
    if (!productVariant) {
      throw new NotFoundException(
        `The Product-Variant with ID: ${id} was Not Found`,
      );
    }
    return productVariant;
  }

  async findOneBySku(sku: string) {
    return await this.productVariantRepository.findOne({
      where: { sku },
      relations: ['product'],
    });
  }

  async createEntity(payload: CreateProductVariantDTO) {
    console.log('====== 3');
    let newProductVariant: ProductVariant =
      this.productVariantRepository.create(payload);
    if (newProductVariant.discountPrice === '') {
      newProductVariant.discountPrice = '0';
    }
    if (payload.productId) {
      const product = await this.productService.findOne(payload.productId);
      newProductVariant.product = product;
    }
    if (payload.variantAttributeIds && payload.variantAttributeIds.length > 0) {
      const variants = await this.variantAttributeRepository.findBy({
        id: In(payload.variantAttributeIds),
      });
      newProductVariant.variantsAttributes = variants;
    }
    newProductVariant =
      await this.productVariantRepository.save(newProductVariant);
    if (payload.images && payload.images.length > 0) {
      for (const image of payload.images) {
        const newImage = await this.imageService.createEntity({
          reference: `product-variant-${newProductVariant.id}`,
          isFrontImage: image.isFrontImage || false,
          url: image.url,
          productVariantId: newProductVariant.id,
        });
      }
    }
    return newProductVariant;
  }

  //TODO: Update logic depending on Admin panel requirements
  async updateEntity(id: string, payload: UpdateProductVariantDTO) {
    console.log('attempt service');
    const productVariant = await this.productVariantRepository.findOneBy({
      id,
    });
    if (!productVariant) {
      throw new NotFoundException(
        `The Product-Variant with ID: ${id} was Not Found`,
      );
    }
    console.log('Holi 1');
    this.productVariantRepository.merge(productVariant, payload);
    if (payload.images && payload.images.length > 0) {
      for (const image of payload.images) {
        console.log('Holi 2 -> for cycle');
        const newImage = await this.imageService.createEntity({
          reference: `product-variant-${productVariant.id}`,
          isFrontImage: image.isFrontImage || false,
          url: image.url,
          productVariantId: productVariant.id,
        });
      }
    }
    console.log('Holi 3');
    const updateFrontImg = await this.imageService.updateFrontImage(productVariant.id);
    const updatedImages = await this.imageService.findAll(productVariant.id);
    productVariant.images = updatedImages;
    return this.productVariantRepository.save(productVariant);
  }

  async updateSales(id: string, quantity: number) {
    const productVariant = await this.productVariantRepository.findOneBy({
      id,
    });
    if (!productVariant) {
      throw new NotFoundException(
        `The Product-Variant with ID: ${id} was Not Found`,
      );
    }
    return await this.productVariantRepository.increment(
      { id },
      'totalSales',
      quantity,
    );
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
