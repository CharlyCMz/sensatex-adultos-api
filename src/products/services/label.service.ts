import { Injectable, NotFoundException } from '@nestjs/common';
import { Label } from '../entities/label.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateLabelDTO, UpdateLabelDTO } from '../dtos/label.dto';
import { SubCategoryService } from './sub-category.service';

@Injectable()
export class LabelService {
  constructor(
    @InjectRepository(Label)
    private labelRepository: Repository<Label>,
    private subCategoryService: SubCategoryService,
  ) {}

  findAll() {
    return this.labelRepository.find({
      relations: ['subCategory']
    });
  }

  async findByName(filter: string) {
    return await this.labelRepository
      .createQueryBuilder('label')
      .select(['label.id', 'label.title'])
      .where('LOWER(label.title) LIKE :filter', {
        filter: `%${filter.toLowerCase()}%`,
      })
      .getOne();
  }

  async findOne(id: string) {
    const label = await this.labelRepository
      .createQueryBuilder('label')
      .leftJoinAndSelect('label.subCategory', 'subCategory')
      .leftJoinAndSelect('label.products', 'products')
      .where('label.id = :id', { id })
      .getOne();
    if (!label) {
      throw new NotFoundException(`The Label with ID: ${id} was Not Found`);
    }
    return label;
  }

  async createEntity(payload: CreateLabelDTO) {
    const newLabel = this.labelRepository.create(payload);
    if (payload.subCategoryId) {
      newLabel.subCategory = await this.subCategoryService.findOneNoRelations(
        payload.subCategoryId,
      );
    }
    return await this.labelRepository.save(newLabel);
  }

  async updateEntity(id: string, payload: UpdateLabelDTO) {
    const label = await this.labelRepository.findOneBy({ id });
    if (!label) {
      throw new NotFoundException(`The Label with ID: ${id} was Not Found`);
    }
    this.labelRepository.merge(label, payload);
    return this.labelRepository.save(label);
  }

  async deleteEntity(id: string) {
    const exist = await this.labelRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException(`The Label with ID: ${id} was Not Found`);
    }
    return this.labelRepository.softDelete(id);
  }

  async eliminateEntity(id: string) {
    const exist = await this.labelRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException(`The Label with ID: ${id} was Not Found`);
    }
    return this.labelRepository.delete(id);
  }
}
