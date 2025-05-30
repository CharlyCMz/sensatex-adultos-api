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

@Module({
  controllers: [
    AttributeController,
    CategoryController,
    ImageController,
    LabelController,
    ProductVariantController,
    ProductController,
    VariantAttributeController,
  ],
  providers: [
    AttributeService,
    CategoryService,
    ImageService,
    LabelService,
    ProductVariantService,
    ProductService,
    VariantAttributeService,
  ],
})
export class ProductsModule {}
