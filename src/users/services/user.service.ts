import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { CreateUserDTO, UpdateUserDTO } from '../dtos/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PersonService } from './person.service';
import { RoleService } from './role.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private personService: PersonService,
    private roleService: RoleService,
  ) {}

  findAll() {
    return this.userRepository.find({
      relations: ['roles'],
    });
  }

  async findOne(id: string) {
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

  findByUsername(username: string) {
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.person', 'person')
      .where('user.username = :username', { username })
      .getOne()
      .then((user) => {
        if (!user) {
          throw new NotFoundException(`The User with Username: ${username} was Not Found`);
        }
        return user;
      });
  }

  findByEmail(email: string) {
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.person', 'person')
      .where('person.email = :email', { email })
      .getOne()
      .then((user) => {
        if (!user) {
          throw new NotFoundException(`The User with Email: ${email} was Not Found`);
        }
        return user;
      });
  }

  async createEntity(payload: CreateUserDTO) {
    const person = await this.personService.createEntity(payload.person);
    const role = await this.roleService.findOne(payload.roleId);
    const newUser = this.userRepository.create(payload);
    newUser.password = await bcrypt.hash(payload.password, 10);
    newUser.person = person;
    newUser.role = role;
    return this.userRepository.save(newUser);
  }

  async updateEntity(id: string, payload: UpdateUserDTO) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`The User with ID: ${id} was Not Found`);
    }
    this.userRepository.merge(user, payload);
    return this.userRepository.save(user);
  }

  async deleteEntity(id: string) {
    const exist = await this.userRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException(`The User with ID: ${id} was Not Found`);
    }
    return this.userRepository.softDelete(id);
  }

  async eliminateEntity(id: string) {
    const exist = await this.userRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException(`The User with ID: ${id} was Not Found`);
    }
    return this.userRepository.delete(id);
  }
}
