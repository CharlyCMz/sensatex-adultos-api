import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'sales' })
export class Sell {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'numeric', precision: 10, scale: 4, nullable: true })
  purchaseTotal: string;

  @Column({ type: 'numeric', precision: 10, scale: 4, nullable: true })
  shippingTotal: string;

  @Column({ type: 'numeric', precision: 10, scale: 4, nullable: true })
  total: string;

  @Column({ type: 'varchar', length: 24, nullable: true })
  billingAddress: string;

  @Column({ type: 'varchar', length: 24, nullable: true })
  shippingAddress: string;

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
