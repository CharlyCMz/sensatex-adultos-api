import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Attribute } from './attribute.entity';
import { ProductVariant } from './product-variant.entity';

@Entity({ name: 'variants_attributes' })
export class VariantAttribute {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 156, unique: false })
  value: string;

  @ManyToOne(() => Attribute, (attribute) => attribute.variantsAttributes)
  attribute: Attribute;

  @ManyToOne(() => Attribute, (attribute) => attribute.variantsAttributes)
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
