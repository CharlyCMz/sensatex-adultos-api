import { Module } from '@nestjs/common';
import { RoleController } from './controllers/role.controller';
import { UserController } from './controllers/user.controller';
import { PersonController } from './controllers/person.controller';
import { DocTypeController } from './controllers/doc-type.controller';
import { AddressController } from './controllers/address.controller';
import { LocationController } from './controllers/location.controller';

@Module({
  controllers: [RoleController, UserController, PersonController, DocTypeController, AddressController, LocationController]
})
export class UsersModule {}
