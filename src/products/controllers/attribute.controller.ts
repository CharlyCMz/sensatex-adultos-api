import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AttributeService } from '../services/attribute.service';
import { CreateAttributeDTO, UpdateAttributeDTO } from '../dtos/attribute.dto';

@Controller('attributes')
export class AttributeController {
  constructor(private attributeService: AttributeService) {}

  @Post()
  createEntity(@Body() payload: CreateAttributeDTO) {
    return this.attributeService.createEntity(payload);
  }

  @Get()
  findAll() {
    return this.attributeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attributeService.findOne(id);
  }

  @Put(':id')
  updateEntity(@Param('id') id: string, @Body() payload: UpdateAttributeDTO) {
    return this.attributeService.updateEntity(id, payload);
  }

  @Delete(':id')
  deleteEntity(@Param('id') id: string) {
    return this.attributeService.deleteEntity(id);
  }

  @Delete('eliminate/:id')
  eliminateEntity(@Param('id') id: string) {
    return this.attributeService.eliminateEntity(id);
  }
}
