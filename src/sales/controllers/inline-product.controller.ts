import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { InlineProductService } from '../services/inline-product.service';
import { CreateInlineProductDTO, UpdateInlineProductDTO } from '../dtos/inline-product.dto';

@Controller('inline-products')
export class InlineProductController {
  constructor(private inlineProductService: InlineProductService) {}

  @Post()
  createEntity(@Body() payload: CreateInlineProductDTO) {
    return this.inlineProductService.createEntity(payload);
  }

  @Get()
  findAll() {
    return this.inlineProductService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.inlineProductService.findOne(id);
  }

  @Put(':id')
  updateEntity(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateInlineProductDTO,
  ) {
    return this.inlineProductService.updateEndity(id, payload);
  }

  @Delete(':id')
  deleteEntity(@Param('id', ParseIntPipe) id: number) {
    return this.inlineProductService.deleteEntity(id);
  }

  @Delete('eliminate/:id')
  eliminateEntity(@Param('id', ParseIntPipe) id: number) {
    return this.inlineProductService.eliminateEntity(id);
  }
}
