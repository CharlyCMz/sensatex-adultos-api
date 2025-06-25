import { Global, Module } from '@nestjs/common';
import { CsvProcessorService } from './csv-processor/csv-processor.service';
import { MercadopagoService } from './mercadopago/mercadopago.service';
import { MercadopagoController } from './mercadopago/mercadopago.controller';
import { MailerService } from './mailer/mailer.service';

@Global()
@Module({
  providers: [CsvProcessorService, MercadopagoService, MailerService],
  exports: [CsvProcessorService, MercadopagoService, MailerService],
  controllers: [MercadopagoController],
})
export class UtilsModule {}
