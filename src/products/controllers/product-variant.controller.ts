import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ProductVariantService } from '../services/product-variant.service';
import { CreateProductVariantDTO, UpdateProductVariantDTO } from '../dtos/product-variant.dto';

@Controller('product-variants')
export class ProductVariantController {
  constructor(private productVariantService: ProductVariantService) {}

    @Post()
    createEntity(@Body() payload: CreateProductVariantDTO) {
      return this.productVariantService.createEntity(payload);
    }

    @Get()
    findAll() {
      return this.productVariantService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: string) {
      return this.productVariantService.findOne(id);
    }

    @Put(':id')
    updateEntity(
      @Param('id') id: string,
      @Body() payload: UpdateProductVariantDTO,
    ) {
      return this.productVariantService.updateEntity(id, payload);
    }

    @Delete(':id')
    deleteEntity(@Param('id') id: string) {
      return this.productVariantService.deleteEntity(id);
    }

    @Delete('eliminate/:id')
    eliminateEntity(@Param('id') id: string) {
      return this.productVariantService.eliminateEntity(id);
    }
}
