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
import { InlineProduct } from './inline-products.entity';
import { Person } from 'src/users/entities/person.entity';

@Entity({ name: 'sales' })
export class Sell {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    name: 'tracking_code',
    length: 64,
    nullable: true,
    unique: true,
  })
  trackingCode: string;

  @Column({
    type: 'numeric',
    name: 'purchase_total',
    precision: 10,
    scale: 4,
    nullable: true,
  })
  purchaseTotal: string;

  @Column({
    type: 'numeric',
    name: 'shipping_total',
    precision: 10,
    scale: 4,
    nullable: true,
  })
  shippingTotal: string;

  @Column({
    type: 'numeric',
    name: 'total',
    precision: 10,
    scale: 4,
    nullable: true,
  })
  total: string;

  @Column({
    type: 'varchar',
    name: 'billing_address',
    length: 256,
    nullable: true,
  })
  billingAddress: string;

  @Column({
    type: 'varchar',
    name: 'shipping_address',
    length: 256,
    nullable: true,
  })
  shippingAddress: string;

  @Column({ type: 'varchar', name: 'status', length: 24, nullable: true })
  status: string;

  @Column({
    type: 'varchar',
    name: 'payment_link',
    length: 512,
    nullable: true,
  })
  paymentLink: string;

  @Column({
    type: 'varchar',
    name: 'mp_payment_id',
    length: 512,
    nullable: true,
  })
  mpPaymentId: string;

  @Column({ type: 'varchar', name: 'transporter', length: 512, nullable: true })
  transporter: string;

  @Column({
    type: 'varchar',
    name: 'transporter_tracking',
    length: 512,
    nullable: true,
  })
  transporterTracking: string;

  @Column({
    type: 'text',
    name: 'notes',
    nullable: true,
  })
  notes: string;

  @OneToMany(() => InlineProduct, (inlineProduct) => inlineProduct.sell)
  inlineProducts: InlineProduct[];

  @ManyToOne(() => Person, (person) => person.sells)
  person: Person;

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
