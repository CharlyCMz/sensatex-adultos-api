import { Global, Module } from '@nestjs/common';
import { CsvProcessorService } from './csv-processor/csv-processor.service';

@Global()
@Module({
  providers: [CsvProcessorService],
  exports: [CsvProcessorService],
})
export class UtilsModule {}
