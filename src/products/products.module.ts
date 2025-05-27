import { Module } from '@nestjs/common';
import { AttributeController } from './controllers/attribute.controller';
import { CategoryController } from './controllers/category.controller';
import { ImageController } from './controllers/image.controller';
import { LabelController } from './controllers/label.controller';
import { ProductVariantController } from './controllers/product-variant.controller';
import { ProductController } from './controllers/product.controller';
import { VariantAttributeController } from './controllers/variant-attribute.controller';

@Module({
  controllers: [AttributeController, CategoryController, ImageController, LabelController, ProductVariantController, ProductController, VariantAttributeController]
})
export class ProductsModule {}
