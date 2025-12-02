import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateImageDTO, UpdateImageDTO } from '../dtos/image.dto';
import { Image } from '../entities/image.entity';
import { ProductVariantService } from './product-variant.service';
import { ProductVariant } from '../entities/product-variant.entity';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
    @InjectRepository(ProductVariant)
    private productVariantRepository: Repository<ProductVariant>,
  ) {}

  findAll(productVariantId?: string) {
    const query = this.imageRepository.createQueryBuilder('image');

    if (productVariantId) {
      query
        .leftJoin('image.productVariant', 'productVariant')
        .where('productVariant.id = :id', { id: productVariantId });
    }

    return query.getMany();
  }

  async findOne(id: string) {
    const image = await this.imageRepository
      .createQueryBuilder('image')
      .leftJoinAndSelect('image.productvariant', 'productvariant')
      .where('image.id = :id', { id })
      .getOne();
    if (!image) {
      throw new NotFoundException(`The Image with ID: ${id} was Not Found`);
    }
    return image;
  }

  async createEntity(payload: CreateImageDTO) {
    const newImage = this.imageRepository.create({
      reference: payload.reference,
      isFrontImage: payload.isFrontImage ?? false,
      url: payload.url,
    });

    if (payload.productVariantId) {
      newImage.productVariant = {
        id: payload.productVariantId,
      } as ProductVariant;
    }

    return await this.imageRepository.save(newImage);
  }

  async updateEntity(id: string, payload: UpdateImageDTO) {
    let image = await this.imageRepository.findOne({
      where: { id },
      relations: ['productVariant'],
    });
    if (!image) {
      throw new NotFoundException(`The Image with ID: ${id} was Not Found`);
    }
    if (payload.productVariantId) {
      image.productVariant = {
        id: payload.productVariantId,
      } as ProductVariant;
    }
    this.imageRepository.merge(image, payload);
    image = await this.imageRepository.save(image);
    if (image.productVariant) {
      const updateImgs = await this.updateFrontImage(image.productVariant.id, image.id);
    }
    return image;
  }

  async updateFrontImage(productVariantId: string, imageId: string): Promise<boolean> {
    await this.imageRepository
      .createQueryBuilder()
      .update()
      .set({ isFrontImage: false })
      .where('productVariantId = :id', { id: productVariantId })
      .andWhere('id <> :imageId', { imageId })
      .execute();
    return true;
  }

  async deleteEntity(id: string) {
    const exist = await this.imageRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException(`The Image with ID: ${id} was Not Found`);
    }
    return this.imageRepository.softDelete(id);
  }

  async eliminateEntity(id: string) {
    const exist = await this.imageRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException(`The Image with ID: ${id} was Not Found`);
    }
    return this.imageRepository.delete(id);
  }
}
