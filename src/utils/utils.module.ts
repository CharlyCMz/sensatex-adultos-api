import { Global, Module } from '@nestjs/common';
import { CsvProcessorService } from './csv-processor/csv-processor.service';
import { MercadopagoService } from './mercadopago/mercadopago.service';
import { MercadopagoController } from './mercadopago/mercadopago.controller';

@Global()
@Module({
  providers: [CsvProcessorService, MercadopagoService],
  exports: [CsvProcessorService, MercadopagoService],
  controllers: [MercadopagoController],
})
export class UtilsModule {}
