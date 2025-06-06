import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellController } from './controllers/sell.controller';
import { InlineProductController } from './controllers/inline-product.controller';
import { SellService } from './services/sell.service';
import { InlineProductService } from './services/inline-product.service';
import { Sell } from './entities/sell.entity';
import { InlineProduct } from './entities/inline-products.entity';
import { UsersModule } from 'src/users/users.module';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [TypeOrmModule.forFeature([Sell, InlineProduct]), UsersModule, ProductsModule],
  controllers: [SellController, InlineProductController],
  providers: [SellService, InlineProductService],
})
export class SalesModule {}
