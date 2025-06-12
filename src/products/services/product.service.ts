import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Product } from '../entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateProductDTO, UpdateProductDTO } from '../dtos/product.dto';
import { ProductVariantService } from './product-variant.service';
import { Label } from '../entities/label.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Label)
    private labelRepository: Repository<Label>,
  ) {}

  findAll() {
    return this.productRepository.find({
      relations: ['productVariants'],
    });
  }

  async findOne(id: number) {
    const product = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.productVariants', 'productVariants')
      .leftJoinAndSelect('productVariants.images', 'images')
      .leftJoinAndSelect(
        'productVariants.variantAttributes',
        'variantAttributes',
      )
      .leftJoinAndSelect('variantAttributes.attribute', 'attribute')
      .leftJoinAndSelect('product.labels', 'labels')
      .leftJoinAndSelect('product.categories', 'categories')
      .where('product.id = :id', { id })
      .getOne();
    if (!product) {
      throw new NotFoundException(`The Product with ID: ${id} was Not Found`);
    }
    return product;
  }

  async createEntity(payload: CreateProductDTO) {
    const newProduct = this.productRepository.create(payload);
    const labels = await this.labelRepository.findBy({
      id: In(payload.labelIds),
    });
    newProduct.labels = labels;
    return await this.productRepository.save(payload);
  }

  async updateEntity(id: number, payload: UpdateProductDTO) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`The Product with ID: ${id} was Not Found`);
    }
    if (payload.labelIds) {
      const labels = await this.labelRepository.findBy({
        id: In(payload.labelIds),
      });
      product.labels = labels;
    }
    this.productRepository.merge(product, payload);
    return this.productRepository.save(product);
  }

  async deleteEntity(id: number) {
    const exist = await this.productRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException(`The Product with ID: ${id} was Not Found`);
    }
    return this.productRepository.softDelete(id);
  }

  async eliminateEntity(id: number) {
    const exist = await this.productRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException(`The Product with ID: ${id} was Not Found`);
    }
    return this.productRepository.delete(id);
  }

  //#region Label Management
  async removeLabelFromProduct(productId: number, labelId: number) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['labels'],
    });
    if (!product) {
      throw new NotFoundException(`The Product with ID: ${productId} was Not Found`);
    }
    const label = await this.labelRepository.findOneBy({ id: labelId });
    if (!label) {
      throw new NotFoundException(`The Label with ID: ${labelId} was Not Found`);
    }
    product.labels = product.labels.filter((l) => l.id !== labelId);
    return this.productRepository.save(product);
  }

  async addLabelToProduct(productId: number, labelId: number) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['labels'],
    });
    if (!product) {
      throw new NotFoundException(`The Product with ID: ${productId} was Not Found`);
    }
    const label = await this.labelRepository.findOneBy({ id: labelId });
    if (!label) {
      throw new NotFoundException(`The Label with ID: ${labelId} was Not Found`);
    }
    if (product.labels.some((l) => l.id === labelId)) {
      throw new BadRequestException(`The Label with ID: ${labelId} is already associated with this Product`);
    }
    product.labels.push(label);
    return this.productRepository.save(product);
  }
  //#endregion
}
