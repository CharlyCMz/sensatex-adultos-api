import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { CreateUserDTO, UpdateUserDTO } from '../dtos/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PersonService } from './person.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private personService: PersonService,
  ) {}

  findAll() {
    return this.userRepository.find({
      relations: ['roles'],
    });
  }

  async findOne(id: number) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.person', 'person')
      .where('user.id = :id', { id })
      .getOne();
    if (!user) {
      throw new NotFoundException(`The User with ID: ${id} was Not Found`);
    }
    return user;
  }

  async createEntity(payload: CreateUserDTO) {
    const person = await this.personService.createEntity(payload.person);
    const newUser = this.userRepository.create(payload);
    newUser.person = person;
    return this.userRepository.save(newUser);
  }

  async updateEndity(id: number, payload: UpdateUserDTO) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`The User with ID: ${id} was Not Found`);
    }
    this.userRepository.merge(user, payload);
    return this.userRepository.save(user);
  }

  async deleteEntity(id: number) {
    const exist = await this.userRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException(`The User with ID: ${id} was Not Found`);
    }
    return this.userRepository.softDelete(id);
  }

  async eliminateEntity(id: number) {
    const exist = await this.userRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException(`The User with ID: ${id} was Not Found`);
    }
    return this.userRepository.delete(id);
  }
}
