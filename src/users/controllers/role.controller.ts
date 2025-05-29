import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { RoleService } from '../services/role.service';
import { CreateRoleDTO, UpdateRoleDTO } from '../dtos/role.dto';

@Controller('roles')
export class RoleController {
  //Injection of Service
  constructor(private roleService: RoleService) {}

  //Category addition "Create"
  @Post()
  //@HttpCode(201) // Set HTTP status code to 201 Created
  createEntity(@Body() payload: CreateRoleDTO) {
    return this.roleService.createEntity(payload);
  }

  //Listing all categories "Read"
  @Get()
  findAll() {
    return this.roleService.findAll();
  }

  //Searching for one category "Read"
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.findOne(id);
  }

  // Category modification "Update"
  @Put(':id')
  updateEntity(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateRoleDTO,
  ) {
    return this.roleService.updateEndity(id, payload);
  }

  //Category Elimination "Delete"
  @Delete(':id')
  deleteEntity(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.deleteEntity(id);
  }
}
