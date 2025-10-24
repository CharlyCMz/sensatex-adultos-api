import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { CreateProductDTO, UpdateProductDTO } from '../dtos/product.dto';
import { ProductVariantService } from '../services/product-variant.service';
import { CategoryService } from '../services/category.service';
import { SubCategoryService } from '../services/sub-category.service';
import { LabelService } from '../services/label.service';
import { CustomAuthGuard } from 'src/auth/guards/custom-auth.guard';
import { Public } from 'src/auth/decorators/public.decorator';

@UseGuards(CustomAuthGuard)
@Controller('products')
export class ProductController {
  constructor(
    private productService: ProductService,
    private productVariantService: ProductVariantService,
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService,
    private labelService: LabelService,
  ) {}

  @Post()
  async createEntity(@Body() payload: CreateProductDTO) {
    for (const variant of payload.productVariants) {
      const variantExist = await this.productVariantService.findOneBySku(
        variant.sku,
      );
      if (variantExist) {
        throw new BadRequestException({
          message: `Variante de producto con SKU: ${variant.sku} ya existe`,
          product: variantExist.product.name,
          statusCode: 400,
        });
      }
    }
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
  @Public()
  findAll(
    @Query('status') status?: string,
    @Query('categoryId') categoryId?: string,
    @Query('subCategoryId') subCategoryId?: string,
    @Query('labelId') labelId?: string,
    @Query('nameFilter') nameFilter?: string,
    @Query('brand') brand?: string,
    @Query('sku') sku?: string,
    @Query('isAvailable') isAvailable?: boolean,
    @Query('orderBy') orderBy?: string,
    @Query('order') order?: 'ASC' | 'DESC',
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNumber = parseInt(page || '1', 10);
    const limitNumber = parseInt(limit || '20', 10);
    return this.productService.findAll(
      pageNumber,
      limitNumber,
      status,
      categoryId,
      subCategoryId,
      labelId,
      nameFilter,
      brand,
      sku,
      isAvailable,
      orderBy,
      order,
    );
  }

  @Get('top-sales')
  @Public()
  topSales() {
    return this.productService.findTopSales();
  }

  @Get('sold-out')
  @Public()
  soldOut() {
    return this.productVariantService.findSoldOut();
  }

  @Get('new-products')
  @Public()
  newProducts() {
    return this.productService.findNewProducts();
  }

  @Get('related-products/:id')
  @Public()
  relatedProducts(@Param('id') id: string) {
    return this.productService.findRelatedProducts(id);
  }

  @Get('search-bar/:filter')
  @Public()
  async searchBar(@Param('filter') filter: string) {
    const searchBarResponse = {
      category: await this.categoryService.findByName(filter),
      subCategory: await this.subCategoryService.findByName(filter),
      labels: await this.labelService.findByName(filter),
      products: await this.productService.findByName(filter),
    };
    return searchBarResponse;
  }

  @Get(':id')
  @Public()
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
