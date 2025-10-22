import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProductVariantService } from '../services/product-variant.service';
import {
  CreateProductVariantDTO,
  UpdateProductVariantDTO,
} from '../dtos/product-variant.dto';
import { CustomAuthGuard } from 'src/auth/guards/custom-auth.guard';
import { Public } from 'src/auth/decorators/public.decorator';

@UseGuards(CustomAuthGuard)
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
  @Public()
  findOne(@Param('id') id: string) {
    return this.productVariantService.findOne(id);
  }

  @Put(':id')
  updateEntity(
    @Param('id') id: string,
    @Body() payload: UpdateProductVariantDTO,
  ) {
    console.log('attempt controller', payload);
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

  @Delete(':id/variant/:variantId')
  deleteVariant(
    @Param('id') id: string,
    @Param('variantId') variantId: string,
  ) {
    return this.productVariantService.removeVariantFromProduct(id, variantId);
  }

  @Put(':id/variant/:variantId')
  addVariant(@Param('id') id: string, @Param('variantId') variantId: string) {
    return this.productVariantService.addVariantToProduct(id, variantId);
  }

  @Get('increment-sales/:id')
  incrementSales(@Param('id') id: string) {
    return this.productVariantService.updateSales(id, 3);
  }
}
