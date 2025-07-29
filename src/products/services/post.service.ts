import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from '../entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDTO, UpdatePostDTO } from '../dtos/post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async findAll(isBanner?: boolean, isMovile?: boolean, isPost?: boolean) {
    const query = this.postRepository
      .createQueryBuilder('post')
      .orderBy('post.createdAt', 'DESC');
    if (isBanner !== undefined) {
      query
        .andWhere('post.isBanner = :isBanner', { isBanner })
        .take(5);
    }
    if (isPost !== undefined) {
      query.andWhere('post.isPost = :isPost', { isPost }).take(10);
    }
    const result = await query.getMany();
    console.log(result);
    return result;
  }

  async findOne(id: string) {
    const post = await this.postRepository
      .createQueryBuilder('post')
      .where('post.id = :id', { id })
      .getOne();
    if (!post) {
      throw new NotFoundException(`The Post with ID: ${id} was Not Found`);
    }
    return post;
  }

  async createEntity(payload: CreatePostDTO) {
    const newPost = this.postRepository.create(payload);
    return this.postRepository.save(newPost);
  }

  async updateEntity(id: string, payload: UpdatePostDTO) {
    const post = await this.postRepository.findOneBy({ id });
    if (!post) {
      throw new NotFoundException(`The Post with ID: ${id} was Not Found`);
    }
    this.postRepository.merge(post, payload);
    return this.postRepository.save(post);
  }

  async deleteEntity(id: string) {
    const exist = await this.postRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException(`The Post with ID: ${id} was Not Found`);
    }
    return this.postRepository.softDelete(id);
  }

  async eliminateEntity(id: string) {
    const exist = await this.postRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException(`The Post with ID: ${id} was Not Found`);
    }
    return this.postRepository.delete(id);
  }
}
