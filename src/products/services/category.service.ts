import { Injectable, NotFoundException } from '@nestjs/common';
import { Category } from '../entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDTO, UpdateCategoryDTO } from '../dtos/category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async findAll() {
    return await this.categoryRepository.find({
      relations: ['subCategories', 'subCategories.labels'],
    });
  }

  async findByName(filter: string) {
    return await this.categoryRepository
      .createQueryBuilder('category')
      .select(['category.id', 'category.title'])
      .where('LOWER(category.title) LIKE :filter', {
        filter: `%${filter.toLowerCase()}%`,
      })
      .getOne();
  }

  async findOne(id: string) {
    const category = await this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.subCategories', 'subCategories')
      .leftJoinAndSelect('subCategories.labels', 'labels')
      .where('category.id = :id', { id })
      .getOne();
    if (!category) {
      throw new NotFoundException(`The Category with ID: ${id} was Not Found`);
    }
    return category;
  }

  async findOneNoRelations(id: string) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException(`The Category with ID: ${id} was Not Found`);
    }
    return category;
  }

  createEntity(payload: CreateCategoryDTO) {
    const newCategory = this.categoryRepository.create(payload);
    return this.categoryRepository.save(newCategory);
  }

  async updateEntity(id: string, payload: UpdateCategoryDTO) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException(`The Category with ID: ${id} was Not Found`);
    }
    this.categoryRepository.merge(category, payload);
    return this.categoryRepository.save(category);
  }

  async deleteEntity(id: string) {
    const exist = await this.categoryRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException(`The Category with ID: ${id} was Not Found`);
    }
    return this.categoryRepository.softDelete(id);
  }

  async eliminateEntity(id: string) {
    const exist = await this.categoryRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException(`The Category with ID: ${id} was Not Found`);
    }
    return this.categoryRepository.delete(id);
  }
}
