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
import { ProductService } from '../services/product.service';
import { CreateProductDTO, UpdateProductDTO } from '../dtos/product.dto';
import { ProductVariantService } from '../services/product-variant.service';
import { VariantAttributeService } from '../services/variant-attribute.service';

@Controller('products')
export class ProductController {
  constructor(
    private productService: ProductService,
    private readonly productVariantService: ProductVariantService,
    private readonly variantAttributeService: VariantAttributeService,
  ) {}

  @Post()
  async createEntity(@Body() payload: CreateProductDTO) {
    let newProduct = await this.productService.createEntity(payload);
    for (const variant of payload.productVariants) {
      const newProductVariant = await this.productVariantService.createEntity({
        ...variant,
        productId: newProduct.id,
      });
      for (const attribute of variant.variantAttributes) {
        const newVariantAttribute =
          await this.variantAttributeService.createEntity({
            ...attribute,
            productVariantId: newProductVariant.id,
          });
      }
    }
    let resultingProduct = await this.productService.findOne(newProduct.id);
    return resultingProduct;
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  @Put(':id')
  updateEntity(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateProductDTO,
  ) {
    return this.productService.updateEntity(id, payload);
  }

  @Delete(':id')
  deleteEntity(@Param('id', ParseIntPipe) id: number) {
    return this.productService.deleteEntity(id);
  }

  @Delete('eliminate/:id')
  eliminateEntity(@Param('id', ParseIntPipe) id: number) {
    return this.productService.eliminateEntity(id);
  }

  @Delete(':id/label/:labelId')
  deleteLabel(
    @Param('id', ParseIntPipe) id: number,
    @Param('labelId', ParseIntPipe) labelId: number,
  ) {
    return this.productService.removeLabelFromProduct(id, labelId);
  }

  @Put(':id/label/:labelId')
  addLabel(
    @Param('id', ParseIntPipe) id: number,
    @Param('labelId', ParseIntPipe) labelId: number,
  ) {
    return this.productService.addLabelToProduct(id, labelId);
  }
}
