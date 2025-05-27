import { Module } from '@nestjs/common';
import { SellController } from './controllers/sell.controller';
import { InlineProductController } from './controllers/inline-product.controller';
import { SellService } from './services/sell.service';
import { InlineProductService } from './services/inline-product.service';

@Module({
  controllers: [SellController, InlineProductController],
  providers: [SellService, InlineProductService]
})
export class SalesModule {}
