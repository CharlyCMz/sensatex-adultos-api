import { Module } from '@nestjs/common';
import { SellController } from './controllers/sell.controller';
import { InlineProductController } from './controllers/inline-product.controller';

@Module({
  controllers: [SellController, InlineProductController]
})
export class SalesModule {}
