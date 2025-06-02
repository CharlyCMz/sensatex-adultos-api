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
import { VariantAttributeService } from '../services/variant-attribute.service';
import {
  CreateVariantAttributeDTO,
  UpdateVariantAttributeDTO,
} from '../dtos/variant-attribute.dto';

@Controller('variant-attributes')
export class VariantAttributeController {
  constructor(private variantAttributeService: VariantAttributeService) {}

  @Post()
  createEntity(@Body() payload: CreateVariantAttributeDTO) {
    return this.variantAttributeService.createEntity(payload);
  }

  @Get()
  findAll() {
    return this.variantAttributeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.variantAttributeService.findOne(id);
  }

  @Put(':id')
  updateEntity(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateVariantAttributeDTO,
  ) {
    return this.variantAttributeService.updateEndity(id, payload);
  }

  @Delete(':id')
  deleteEntity(@Param('id', ParseIntPipe) id: number) {
    return this.variantAttributeService.deleteEntity(id);
  }

  @Delete('eliminate/:id')
  eliminateEntity(@Param('id', ParseIntPipe) id: number) {
    return this.variantAttributeService.eliminateEntity(id);
  }
}
