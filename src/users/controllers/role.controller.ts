import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { RoleService } from '../services/role.service';
import { CreateRoleDTO, UpdateRoleDTO } from '../dtos/role.dto';

@Controller('roles')
export class RoleController {
  constructor(private roleService: RoleService) {}

  // @Post()
  // createEntity(@Body() payload: CreateRoleDTO) {
  //   return this.roleService.createEntity(payload);
  // }

  // @Get()
  // findAll() {
  //   return this.roleService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id', ParseIntPipe) id: number) {
  //   return this.roleService.findOne(id);
  // }

  // @Put(':id')
  // updateEntity(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() payload: UpdateRoleDTO,
  // ) {
  //   return this.roleService.updateEndity(id, payload);
  // }

  // @Delete(':id')
  // deleteEntity(@Param('id', ParseIntPipe) id: number) {
  //   return this.roleService.deleteEntity(id);
  // }

  // @Delete('eliminate/:id')
  // eliminateEntity(@Param('id', ParseIntPipe) id: number) {
  //   return this.roleService.eliminateEntity(id);
  // }
}
