import { Module } from '@nestjs/common';
import { AttributeController } from './controllers/attribute.controller';
import { CategoryController } from './controllers/category.controller';
import { ImageController } from './controllers/image.controller';
import { LabelController } from './controllers/label.controller';
import { ProductVariantController } from './controllers/product-variant.controller';
import { ProductController } from './controllers/product.controller';
import { VariantAttributeController } from './controllers/variant-attribute.controller';
import { AttributeService } from './services/attribute.service';
import { CategoryService } from './services/category.service';
import { ImageService } from './services/image.service';
import { LabelService } from './services/label.service';
import { ProductVariantService } from './services/product-variant.service';
import { ProductService } from './services/product.service';
import { VariantAttributeService } from './services/variant-attribute.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attribute } from './entities/attribute.entity';
import { Category } from './entities/category.entity';
import { Image } from './entities/image.entity';
import { Label } from './entities/label.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { Product } from './entities/product.entity';
import { VariantAttribute } from './entities/variant-attribute.entity';
import { SubCategoryService } from './services/sub-category.service';
import { SubCategoryController } from './controllers/sub-category.controller';
import { SubCategory } from './entities/sub-category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Attribute,
      Category,
      Image,
      Label,
      ProductVariant,
      Product,
      VariantAttribute,
      SubCategory,
    ]),
  ],
  controllers: [
    AttributeController,
    CategoryController,
    ImageController,
    LabelController,
    ProductVariantController,
    ProductController,
    VariantAttributeController,
    SubCategoryController,
  ],
  providers: [
    AttributeService,
    CategoryService,
    ImageService,
    LabelService,
    ProductVariantService,
    ProductService,
    VariantAttributeService,
    SubCategoryService,
  ],
  exports: [ProductVariantService, ProductService],
})
export class ProductsModule {}
