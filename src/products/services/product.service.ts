import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Product } from '../entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import {
  CreateProductDTO,
  PaginatedProductDTO,
  UpdateProductDTO,
} from '../dtos/product.dto';
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
      .where('LOWER(product.name) LIKE :filter', {
        filter: `%${filter.toLowerCase()}%`,
      })
      .limit(6)
      .getMany();
  }

  async findAll(
    page: number,
    limit: number,
    status?: string,
    categoryId?: string,
    subCategoryId?: string,
    labelId?: string,
    nameFilter?: string,
    brand?: string,
    sku?: string,
    isAvailable?: boolean,
    orderBy?: string,
    order?: 'ASC' | 'DESC',
  ) {
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
      .leftJoinAndSelect('productSubCategories.category', 'productCategory');

    if (status) {
      query.andWhere('product.status = :status', { status });
    }

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
      query.andWhere('LOWER(product.name) LIKE :nameFilter', {
        nameFilter: `%${nameFilter.toLowerCase()}%`,
      });
    }
    if (brand) {
      query.andWhere('LOWER(product.brand) LIKE :brand', {
        brand: `%${brand.toLowerCase()}%`,
      });
    }
    if (sku) {
      query.andWhere('LOWER(productVariants.sku) LIKE :sku', {
        sku: `%${sku.toLowerCase()}%`,
      });
    }
    if (isAvailable) {
      query.andWhere('productVariants.isAvailable = :isAvailable', {
        isAvailable,
      });
    }

    switch (orderBy) {
      case 'name':
        query.orderBy(`product.name`, order || 'ASC');
        break;
      case 'price':
        query.orderBy(`productVariants.price`, order || 'ASC');
        break;
      case 'createdAt':
        query.orderBy(`productVariants.createdAt`, order || 'ASC');
        break;
      case 'totalSales':
        query.orderBy(`productVariants.totalSales`, order || 'ASC');
        break;
      default:
        query.orderBy('product.createdAt', order || 'DESC');
        break;
    }

    const [items, totalItems] = await query
      .take(limit)
      .skip((page - 1) * limit)
      .getManyAndCount();

    const totalPages = Math.ceil(totalItems / limit);

    const paginatedProducts: PaginatedProductDTO = {
      data: items,
      totalCount: totalItems,
      currentPage: page,
      totalPages,
      nextPage: page < totalPages ? page + 1 : null,
      previousPage: page > 1 ? page - 1 : null,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };

    return paginatedProducts;
  }

  async findTopSales() {
    const productIds = await this.productRepository
      .createQueryBuilder('product')
      .leftJoin('product.productVariants', 'productVariants')
      .select(['product.id AS id', 'productVariants.totalSales AS totalSales'])
      .distinct(true)
      .orderBy('productVariants.totalSales', 'DESC')
      .limit(10)
      .getRawMany();
    const ids = productIds.map((p) => p.id);
    const result = await this.productRepository.find({
      where: { id: In(ids) },
      relations: {
        productVariants: {
          images: true,
        },
      },
    });
    return result;
  }

  async findNewProducts() {
    const productIds = await this.productRepository
      .createQueryBuilder('product')
      .leftJoin('product.productVariants', 'productVariants')
      .select(['product.id AS id', 'product.createdAt as createdAt'])
      .distinct(true)
      .orderBy('product.createdAt', 'DESC')
      .limit(10)
      .getRawMany();
    const ids = productIds.map((p) => p.id);
    const result = await this.productRepository.find({
      where: { id: In(ids) },
      relations: {
        productVariants: {
          images: true,
          variantsAttributes: {
            attribute: true,
          },
        },
      },
    });
    return result;
  }

  async findRelatedProducts(id: string) {
    const product = await this.findOne(id);
    if (!product) {
      throw new NotFoundException(`The Product with ID: ${id} was Not Found`);
    }
    let subCategoryId: string = '';
    if (product.labels.length > 0) {
      subCategoryId = product.labels[0].subCategory.id;
    } else {
      subCategoryId = product.subCategories[0].id;
    }
    const productIds = await this.productRepository
      .createQueryBuilder('product')
      .leftJoin('product.productVariants', 'productVariants')
      .leftJoin('product.subCategories', 'subCategories')
      .select(['product.id AS id', 'productVariants.totalSales as totalSales'])
      .distinct(true)
      .where('subCategories.id = :subCategoryId', { subCategoryId })
      .orderBy('productVariants.totalSales', 'DESC')
      .limit(10)
      .getRawMany();
    const ids = productIds.map((p) => p.id);
    const result = await this.productRepository.find({
      where: { id: In(ids) },
      relations: {
        productVariants: {
          images: true,
        },
      },
    });
    return result;
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
