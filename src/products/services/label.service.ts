import { Injectable, NotFoundException } from '@nestjs/common';
import { Label } from '../entities/label.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLabelDTO, UpdateLabelDTO } from '../dtos/label.dto';
import { CategoryService } from './category.service';

@Injectable()
export class LabelService {
  constructor(
    @InjectRepository(Label)
    private labelRepository: Repository<Label>,
    private categoryService: CategoryService,
  ) {}

  findAll() {
    return this.labelRepository.find();
  }

  async findOne(id: number) {
    const label = await this.labelRepository
      .createQueryBuilder('label')
      .where('label.id = :id', { id })
      .getOne();
    if (!label) {
      throw new NotFoundException(`The Label with ID: ${id} was Not Found`);
    }
    return label;
  }

  async createEntity(payload: CreateLabelDTO) {
    const newLabel = this.labelRepository.create(payload);
    if (payload.categoryId) {
      newLabel.category = await this.categoryService.findOne(
        payload.categoryId,
      );
    }
    return await this.labelRepository.save(newLabel);
  }

  async updateEntity(id: number, payload: UpdateLabelDTO) {
    const label = await this.labelRepository.findOneBy({ id });
    if (!label) {
      throw new NotFoundException(`The Label with ID: ${id} was Not Found`);
    }
    this.labelRepository.merge(label, payload);
    return this.labelRepository.save(label);
  }

  async deleteEntity(id: number) {
    const exist = await this.labelRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException(`The Label with ID: ${id} was Not Found`);
    }
    return this.labelRepository.softDelete(id);
  }

  async eliminateEntity(id: number) {
    const exist = await this.labelRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException(`The Label with ID: ${id} was Not Found`);
    }
    return this.labelRepository.delete(id);
  }
}
