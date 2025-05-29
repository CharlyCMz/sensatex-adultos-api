import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Sell } from './sell.entity';
import { ProductVariant } from 'src/products/entities/product-variant.entity';

@Entity({ name: 'inline_products' })
export class InlineProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  quantity: number;

  @Column({ type: 'numeric', precision: 10, scale: 4, nullable: false })
  inlineTotal: string;

  @ManyToOne(() => Sell, (sell) => sell.inlineProducts)
  sell: Sell;

  @ManyToOne(() => ProductVariant, (productVariant) => productVariant.inlineProducts)
  productVariant: ProductVariant;

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
