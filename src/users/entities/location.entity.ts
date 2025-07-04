import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Address } from './address.entity';

@Entity({ name: 'locations' })
export class Location {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'country_code', type: 'varchar', length: 16 })
  countryCode: string;

  @Column({ name: 'country_name', type: 'varchar', length: 128 })
  countryName: string;

  @Column({ name: 'state_code', type: 'varchar', length: 16 })
  stateCode: string;

  @Column({ name: 'state_name', type: 'varchar', length: 128 })
  stateName: string;

  @Column({ name: 'city_code', type: 'varchar', length: 16 })
  cityCode: string;

  @Column({ name: 'city_name', type: 'varchar', length: 128 })
  cityName: string;

  @OneToMany(() => Address, (address) => address.location)
  addresses: Address[];

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
  })
  deletedAt: Date;
}
