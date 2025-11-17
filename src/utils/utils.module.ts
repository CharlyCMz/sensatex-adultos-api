import { Global, Module } from '@nestjs/common';
import { CsvProcessorService } from './csv-processor/csv-processor.service';
import { MercadopagoService } from './mercadopago/mercadopago.service';
import { MercadopagoController } from './mercadopago/mercadopago.controller';
import { MailerService } from './mailer/mailer.service';
import { AddiService } from './addi/addi.service';
import { AddiController } from './addi/addi.controller';
import { HttpModule } from '@nestjs/axios';

@Global()
@Module({
  providers: [CsvProcessorService, MercadopagoService, MailerService, AddiService],
  exports: [CsvProcessorService, MercadopagoService, MailerService, AddiService],
  controllers: [MercadopagoController, AddiController],
  imports: [HttpModule,]
})
export class UtilsModule {}
