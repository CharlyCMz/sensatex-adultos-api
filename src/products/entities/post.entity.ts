import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductVariant } from './product-variant.entity';

@Entity({ name: 'post' })
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 156, unique: false })
  description: string;

  @Column({
    type: 'varchar',
    length: 1024,
    unique: true,
  })
  url: string;

  @Column({
    type: 'varchar',
    name: 'redirection_url',
    length: 1024,
    unique: true,
  })
  redirectionUrl: string;

  @Column({ type: 'boolean', name: 'is_banner', default: false })
  isBanner: boolean;

  @Column({ type: 'boolean', name: 'is_movile', default: false })
  isMovile: boolean;

  @Column({ type: 'boolean', name: 'is_post', default: false })
  isPost: boolean;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
    nullable: true,
    default: null,
  })
  deletedAt: Date;
}
