import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
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
    const newProduct = await this.productService.createEntity(payload);
    for (const variant of payload.productVariants) {
      const newProductVariant = await this.productVariantService.createEntity({
        ...variant,
        productId: newProduct.id,
      });
    }
    return await this.productService.findOne(newProduct.id);
  }

  @Get()
  findAll(
    @Query('categoryId') categoryId?: string,
    @Query('subCategoryId') subCategoryId?: string,
    @Query('labelId') labelId?: string,
  ) {
    return this.productService.findAll(categoryId, subCategoryId, labelId);
  }

  @Get('top-sales')
  topSales() {
    return this.productService.findTopSales();
  }

  @Get('new-products')
  newProducts() {
    return this.productService.findNewProducts();
  }

  @Get('similar-prodsucts/:id')
  similarProducts(@Param('id') id: string) {
    return this.productService.findRelatedProducts(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Put(':id')
  updateEntity(@Param('id') id: string, @Body() payload: UpdateProductDTO) {
    return this.productService.updateEntity(id, payload);
  }

  @Delete(':id')
  deleteEntity(@Param('id') id: string) {
    return this.productService.deleteEntity(id);
  }

  @Delete('eliminate/:id')
  eliminateEntity(@Param('id') id: string) {
    return this.productService.eliminateEntity(id);
  }

  @Delete(':id/label/:labelId')
  deleteLabel(@Param('id') id: string, @Param('labelId') labelId: string) {
    return this.productService.removeLabelFromProduct(id, labelId);
  }

  @Put(':id/label/:labelId')
  addLabel(@Param('id') id: string, @Param('labelId') labelId: string) {
    return this.productService.addLabelToProduct(id, labelId);
  }

  @Delete(':id/sub-category/:subCategoryId')
  deleteSubCategory(
    @Param('id') id: string,
    @Param('subCategoryId') subCategoryId: string,
  ) {
    return this.productService.removeSubCategoryFromProduct(id, subCategoryId);
  }

  @Put(':id/sub-category/:subCategoryId')
  addSubCategory(
    @Param('id') id: string,
    @Param('subCategoryId') subCategoryId: string,
  ) {
    return this.productService.addSubCategoryToProduct(id, subCategoryId);
  }
}
