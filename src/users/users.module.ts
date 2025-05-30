import { Module } from '@nestjs/common';
import { RoleController } from './controllers/role.controller';
import { UserController } from './controllers/user.controller';
import { PersonController } from './controllers/person.controller';
import { DocTypeController } from './controllers/doc-type.controller';
import { AddressController } from './controllers/address.controller';
import { LocationController } from './controllers/location.controller';
import { AddressService } from './services/address.service';
import { DocTypeService } from './services/doc-type.service';
import { LocationService } from './services/location.service';
import { PersonService } from './services/person.service';
import { RoleService } from './services/role.service';
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { Address } from './entities/address.entity';
import { DocType } from './entities/doc-type.entity';
import { Location } from './entities/location.entity';
import { Person } from './entities/person.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Address, DocType, Location, Person, Role, User]),
  ],
  controllers: [
    RoleController,
    UserController,
    PersonController,
    DocTypeController,
    AddressController,
    LocationController,
  ],
  providers: [
    AddressService,
    DocTypeService,
    LocationService,
    PersonService,
    RoleService,
    UserService,
  ],
})
export class UsersModule {}
