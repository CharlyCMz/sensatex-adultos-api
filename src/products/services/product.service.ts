import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Product } from '../entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Repository } from 'typeorm';
import { CreateProductDTO, UpdateProductDTO } from '../dtos/product.dto';
import { Label } from '../entities/label.entity';
import { SubCategory } from '../entities/sub-category.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Label)
    private labelRepository: Repository<Label>,
    @InjectRepository(SubCategory)
    private subCategoryRepository: Repository<SubCategory>,
  ) {}

  async findByName(filter: string) {
    return await this.productRepository
      .createQueryBuilder('product')
      .select(['product.id', 'product.name'])
      .where('LOWER(product.name) LIKE :filter', { filter: `%${filter.toLowerCase()}%` })
      .limit(6)
      .getMany();
  }

  findAll(categoryId?: string, subCategoryId?: string, labelId?: string, nameFilter?: string) {
    const query = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.productVariants', 'productVariants')
      .leftJoinAndSelect('productVariants.images', 'images')
      .leftJoinAndSelect(
        'productVariants.variantsAttributes',
        'variantsAttributes',
      )
      .leftJoinAndSelect('variantsAttributes.attribute', 'attribute')
      .leftJoinAndSelect('product.labels', 'labels')
      .leftJoinAndSelect('labels.subCategory', 'labelSubCategory')
      .leftJoinAndSelect('labelSubCategory.category', 'labelCategory')
      .leftJoinAndSelect('product.subCategories', 'productSubCategories')
      .leftJoinAndSelect('productSubCategories.category', 'productCategory')
      .orderBy('productVariants.createdAt', 'DESC')
      .addOrderBy('images.createdAt', 'ASC');

    if (categoryId) {
      query.andWhere('productCategory.id = :categoryId', { categoryId });
    }

    if (subCategoryId) {
      query.andWhere('productSubCategories.id = :subCategoryId', {
        subCategoryId,
      });
    }

    if (labelId) {
      query.andWhere('labels.id = :labelId', { labelId });
    }

    if (nameFilter) {
      query.andWhere('LOWER(product.name) LIKE :nameFilter', { nameFilter: `%${nameFilter.toLowerCase()}%` });
    }

    return query.getMany();
  }

  async findTopSales() {
    return await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.productVariants', 'productVariants')
      .leftJoinAndSelect('productVariants.images', 'images')
      .leftJoinAndSelect(
        'productVariants.variantsAttributes',
        'variantsAttributes',
      )
      .leftJoinAndSelect('variantsAttributes.attribute', 'attribute')
      .orderBy('productVariants.totalSales', 'DESC')
      .limit(10)
      .getMany();
  }

  async findNewProducts() {
    return await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.productVariants', 'productVariants')
      .leftJoinAndSelect('productVariants.images', 'images')
      .leftJoinAndSelect(
        'productVariants.variantsAttributes',
        'variantsAttributes',
      )
      .leftJoinAndSelect('variantsAttributes.attribute', 'attribute')
      .orderBy('productVariants.createdAt', 'DESC')
      .limit(10)
      .getMany();
  }

  async findRelatedProducts(id: string) {
    const product = await this.findOne(id);
    if (!product) {
      throw new NotFoundException(`The Product with ID: ${id} was Not Found`);
    }
    return await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.productVariants', 'productVariants')
      .leftJoinAndSelect('productVariants.images', 'images')
      .leftJoinAndSelect(
        'productVariants.variantsAttributes',
        'variantsAttributes',
      )
      .leftJoinAndSelect('variantsAttributes.attribute', 'attribute')
      .leftJoinAndSelect('product.subCategories', 'subCategories')
      .leftJoinAndSelect('subCategories.category', 'category')
      .where('subCategories.id = :subCategoryId', {
        subCategoryId: product.subCategories[0].id,
      })
      .orderBy('productVariants.totalSales', 'DESC')
      .limit(10)
      .getMany();
  }

  async findOne(id: string) {
    const product = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.productVariants', 'productVariants')
      .leftJoinAndSelect('productVariants.images', 'images')
      .leftJoinAndSelect(
        'productVariants.variantsAttributes',
        'variantsAttributes',
      )
      .leftJoinAndSelect('variantsAttributes.attribute', 'attribute')
      .leftJoinAndSelect('product.labels', 'labels')
      .leftJoinAndSelect('labels.subCategory', 'subCategory')
      .leftJoinAndSelect('subCategory.category', 'categoryRefference')
      .leftJoinAndSelect('product.subCategories', 'subCategories')
      .leftJoinAndSelect('subCategories.category', 'category')
      .where('product.id = :id', { id })
      .orderBy('productVariants.createdAt', 'DESC')
      .addOrderBy('images.createdAt', 'ASC')
      .getOne();
    if (!product) {
      throw new NotFoundException(`The Product with ID: ${id} was Not Found`);
    }
    return product;
  }

  async createEntity(payload: CreateProductDTO) {
    const newProduct = this.productRepository.create(payload);
    const subCategories = await this.subCategoryRepository.findBy({
      id: In(payload.subCategoryIds),
    });
    newProduct.subCategories = subCategories;
    const labels = await this.labelRepository.findBy({
      id: In(payload.labelIds),
    });
    newProduct.labels = labels;
    return await this.productRepository.save(newProduct);
  }

  async updateEntity(id: string, payload: UpdateProductDTO) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`The Product with ID: ${id} was Not Found`);
    }
    if (payload.subCategoryIds) {
      const subCategories = await this.subCategoryRepository.findBy({
        id: In(payload.subCategoryIds),
      });
      product.subCategories = subCategories;
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

  async deleteEntity(id: string) {
    const exist = await this.productRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException(`The Product with ID: ${id} was Not Found`);
    }
    return this.productRepository.softDelete(id);
  }

  async eliminateEntity(id: string) {
    const exist = await this.productRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException(`The Product with ID: ${id} was Not Found`);
    }
    return this.productRepository.delete(id);
  }

  //#region Label Management
  async removeLabelFromProduct(productId: string, labelId: string) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['labels'],
    });
    if (!product) {
      throw new NotFoundException(
        `The Product with ID: ${productId} was Not Found`,
      );
    }
    const label = await this.labelRepository.findOneBy({ id: labelId });
    if (!label) {
      throw new NotFoundException(
        `The Label with ID: ${labelId} was Not Found`,
      );
    }
    product.labels = product.labels.filter((l) => l.id !== labelId);
    return this.productRepository.save(product);
  }

  async addLabelToProduct(productId: string, labelId: string) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['labels'],
    });
    if (!product) {
      throw new NotFoundException(
        `The Product with ID: ${productId} was Not Found`,
      );
    }
    const label = await this.labelRepository.findOneBy({ id: labelId });
    if (!label) {
      throw new NotFoundException(
        `The Label with ID: ${labelId} was Not Found`,
      );
    }
    if (product.labels.some((l) => l.id === labelId)) {
      throw new BadRequestException(
        `The Label with ID: ${labelId} is already associated with this Product`,
      );
    }
    product.labels.push(label);
    return this.productRepository.save(product);
  }
  //#endregion

  //#region SubCategory Management
  async removeSubCategoryFromProduct(productId: string, subCategoryId: string) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['subCategories'],
    });
    if (!product) {
      throw new NotFoundException(
        `The Product with ID: ${productId} was Not Found`,
      );
    }
    const subCategory = await this.subCategoryRepository.findOneBy({
      id: subCategoryId,
    });
    if (!subCategory) {
      throw new NotFoundException(
        `The SubCategory with ID: ${subCategoryId} was Not Found`,
      );
    }
    product.subCategories = product.subCategories.filter(
      (sc) => sc.id !== subCategoryId,
    );
    return this.productRepository.save(product);
  }

  async addSubCategoryToProduct(productId: string, subCategoryId: string) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['subCategories'],
    });
    if (!product) {
      throw new NotFoundException(
        `The Product with ID: ${productId} was Not Found`,
      );
    }
    const subCategory = await this.subCategoryRepository.findOneBy({
      id: subCategoryId,
    });
    if (!subCategory) {
      throw new NotFoundException(
        `The SubCategory with ID: ${subCategoryId} was Not Found`,
      );
    }
    if (product.subCategories.some((sc) => sc.id === subCategoryId)) {
      throw new BadRequestException(
        `The SubCategory with ID: ${subCategoryId} is already associated with this Product`,
      );
    }
    product.subCategories.push(subCategory);
    return this.productRepository.save(product);
  }
  //#endregion
}
