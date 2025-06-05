import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateImageDTO, UpdateImageDTO } from '../dtos/image.dto';
import { Image } from '../entities/image.entity';
import { ProductVariantService } from './product-variant.service';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
    private poductVariantService: ProductVariantService,
  ) {}

  findAll(productvariantId?: string) {
    const query = this.imageRepository.createQueryBuilder('image');

    if (productvariantId) {
      query
        .leftJoin('image.productvariant', 'productvariant')
        .where('productvariant.id = :id', { id: productvariantId });
    }

    return query.getMany();
  }

  async findOne(id: number) {
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

  //TODO: method to upload image to cloud storage

  async createEntity(payload: CreateImageDTO) {
    const newImage = this.imageRepository.create(payload);
    newImage.productVariant = await this.poductVariantService.findOne(
      payload.productvariantId,
    );
    //TODO: upload and join the imageUrl from cloud storage.
    return await this.imageRepository.save(newImage);
  }

  async updateEntity(id: string, payload: UpdateImageDTO) {
    const image = await this.imageRepository.findOneBy({ id });
    if (!image) {
      throw new NotFoundException(`The Image with ID: ${id} was Not Found`);
    }
    if (payload.productvariantId) {
      image.productVariant = await this.poductVariantService.findOne(
        payload.productvariantId,
      );
    }
    this.imageRepository.merge(image, payload);
    return this.imageRepository.save(image);
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
