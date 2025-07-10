import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { SubCategory } from '../entities/sub-category.entity';
import {
  CreateSubCategoryDTO,
  UpdateSubCategoryDTO,
} from '../dtos/sub-category.dto';
import { CategoryService } from './category.service';

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectRepository(SubCategory)
    private subCategoryRepository: Repository<SubCategory>,
    private categoryService: CategoryService,
  ) {}

  async findAll() {
    return await this.subCategoryRepository.find({
      relations: ['labels', 'category'],
    });
  }

  async findByName(filter: string) {
    return await this.subCategoryRepository
      .createQueryBuilder('subCategory')
      .select(['subCategory.id', 'subCategory.title'])
      .where('LOWER(subCategory.title) LIKE :filter', { filter: `%${filter.toLowerCase()}%` })
      .getOne();
  }

  async findOne(id: string) {
    const subCategory = await this.subCategoryRepository
      .createQueryBuilder('subCategory')
      .leftJoinAndSelect('subCategory.labels', 'labels')
      .leftJoinAndSelect('subCategory.category', 'category')
      .where('subCategory.id = :id', { id })
      .getOne();
    if (!subCategory) {
      throw new NotFoundException(
        `The SubCategory with ID: ${id} was Not Found`,
      );
    }
    return subCategory;
  }

  async findOneNoRelations(id: string) {
    const subCategory = await this.subCategoryRepository.findOneBy({ id });
    if (!subCategory) {
      throw new NotFoundException(
        `The SubCategory with ID: ${id} was Not Found`,
      );
    }
    return subCategory;
  }

  async createEntity(payload: CreateSubCategoryDTO) {
    const newCategory = this.subCategoryRepository.create(payload);
    newCategory.category = await this.categoryService.findOneNoRelations(
      payload.categoryId,
    );
    return this.subCategoryRepository.save(newCategory);
  }

  async updateEntity(id: string, payload: UpdateSubCategoryDTO) {
    const subCategory = await this.subCategoryRepository.findOneBy({ id });
    if (!subCategory) {
      throw new NotFoundException(
        `The SubCategory with ID: ${id} was Not Found`,
      );
    }
    if (payload.categoryId) {
      subCategory.category = await this.categoryService.findOneNoRelations(
        payload.categoryId,
      );
    }
    this.subCategoryRepository.merge(subCategory, payload);
    return this.subCategoryRepository.save(subCategory);
  }

  async deleteEntity(id: string) {
    const exist = await this.subCategoryRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException(
        `The SubCategory with ID: ${id} was Not Found`,
      );
    }
    return this.subCategoryRepository.softDelete(id);
  }

  async eliminateEntity(id: string) {
    const exist = await this.subCategoryRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException(
        `The SubCategory with ID: ${id} was Not Found`,
      );
    }
    return this.subCategoryRepository.delete(id);
  }
}
