import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { VariantAttribute } from './variant-attribute.entity';
import { Product } from './product.entity';
import { Image } from './image.entity';
import { InlineProduct } from 'src/sales/entities/inline-products.entity';

@Entity({ name: 'product_variants' })
export class ProductVariant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 256, unique: true })
  sku: string;

  @Column({ type: 'numeric', precision: 10, scale: 4 })
  price: string;

  @Column({
    name: 'discount_price',
    type: 'numeric',
    precision: 10,
    scale: 4,
    nullable: true,
    default: null,
  })
  discountPrice: string;

  @Column({ name: 'is_available', type: 'boolean', default: false })
  isAvailable: boolean;

  @OneToMany(
    () => VariantAttribute,
    (variantAttribute) => variantAttribute.attribute,
  )
  variantsAttributes: VariantAttribute[];

  @OneToMany(() => Image, (image) => image.productVariant)
  images: Image[];

  @ManyToOne(() => Product, (product) => product.productVariants)
  product: Product;

  @OneToMany(
    () => InlineProduct,
    (inlineProduct) => inlineProduct.productVariant,
  )
  inlineProducts: InlineProduct[];

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
