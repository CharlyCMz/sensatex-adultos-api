import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { LocationService } from '../services/location.service';
import { CreateLocationDTO, UpdateLocationDTO } from '../dtos/location.dto';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { CsvProcessorService } from 'src/utils/csv-processor/csv-processor.service';

@Controller('locations')
export class LocationController {
  constructor(
    private locationService: LocationService,
    private csvProcessorService: CsvProcessorService,
  ) {}

  @Post()
  createEntity(@Body() payload: CreateLocationDTO) {
    return this.locationService.createEntity(payload);
  }

  @Get()
  findAll() {
    return this.locationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.locationService.findOne(id);
  }

  @Put(':id')
  updateEntity(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateLocationDTO,
  ) {
    return this.locationService.updateEntity(id, payload);
  }

  @Delete(':id')
  deleteEntity(@Param('id', ParseIntPipe) id: number) {
    return this.locationService.deleteEntity(id);
  }

  @Delete('eliminate/:id')
  eliminateEntity(@Param('id', ParseIntPipe) id: number) {
    return this.locationService.eliminateEntity(id);
  }

  @Post('massive-upload')
  @UseInterceptors(FileInterceptor('file'))
  async massiveUpload(@UploadedFile() file: Express.Multer.File) {
    if (!file || file.mimetype != 'text/csv') {
      throw new BadRequestException({
        trigger: 'file',
        message: 'This request needs .csv file',
      });
    }
    const newUpload = await this.csvProcessorService.processCsvBuffer(
      file.buffer,
      'location',
    );
    return await this.locationService.massiveUpload(newUpload);
  }
}
