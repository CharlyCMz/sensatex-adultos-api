import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DocType } from './doc-type.entity';
import { Address } from './address.entity';
import { Sell } from 'src/sales/entities/sell.entity';

@Entity({ name: 'persons' })
export class Person {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => DocType, (docType) => docType.persons)
  docType: DocType;

  @Column({ type: 'varchar', length: 10 })
  document: string;

  @Column({ type: 'varchar', length: 156 })
  name: string;

  @Column({ name: 'middle_name', type: 'varchar', length: 156 })
  midname: string;

  @Column({ name: 'lastname_1', type: 'varchar', length: 156 })
  lastname1: string;

  @Column({ name: 'lastname_2', type: 'varchar', length: 156 })
  lastname2: string;

  @Column({ type: 'varchar', length: 156, unique: true })
  mail: string;

  @Column({ type: 'varchar', length: 156, unique: true })
  phone: string;

  @OneToMany(() => Address, (address) => address.person)
  addresses: Address[];

  @OneToMany(() => Sell, (sell) => sell.person)
  sells: Sell[];

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
