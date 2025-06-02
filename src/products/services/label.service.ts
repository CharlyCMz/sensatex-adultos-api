import { Injectable, NotFoundException } from '@nestjs/common';
import { Label } from '../entities/label.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLabelDTO, UpdateLabelDTO } from '../dtos/label.dto';

@Injectable()
export class LabelService {
  constructor(
    @InjectRepository(Label)
    private labelRepository: Repository<Label>,
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
    return await this.labelRepository.save(newLabel);
  }

  async updateEndity(id: number, payload: UpdateLabelDTO) {
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
