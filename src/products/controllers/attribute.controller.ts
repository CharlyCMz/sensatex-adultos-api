import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
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
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.attributeService.findOne(id);
  }

  @Put(':id')
  updateEntity(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateAttributeDTO,
  ) {
    return this.attributeService.updateEndity(id, payload);
  }

  @Delete(':id')
  deleteEntity(@Param('id', ParseIntPipe) id: number) {
    return this.attributeService.deleteEntity(id);
  }

  @Delete('eliminate/:id')
  eliminateEntity(@Param('id', ParseIntPipe) id: number) {
    return this.attributeService.eliminateEntity(id);
  }
}
