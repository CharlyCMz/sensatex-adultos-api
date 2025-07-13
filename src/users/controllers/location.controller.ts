import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LocationService } from '../services/location.service';
import { CreateLocationDTO, UpdateLocationDTO } from '../dtos/location.dto';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { CsvProcessorService } from 'src/utils/csv-processor/csv-processor.service';
import { Public } from 'src/auth/decorators/public.decorator';
import { CustomAuthGuard } from 'src/auth/guards/custom-auth.guard';

@UseGuards(CustomAuthGuard)
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
  @Public()
  findAll(@Query('stateName') stateName?: string) {
    return this.locationService.findAll(stateName);
  }

  @Get('states')
  @Public()
  findAllStates() {
    return this.locationService.findAllStates();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.locationService.findOne(id);
  }

  @Put(':id')
  updateEntity(@Param('id') id: string, @Body() payload: UpdateLocationDTO) {
    return this.locationService.updateEntity(id, payload);
  }

  @Delete(':id')
  deleteEntity(@Param('id') id: string) {
    return this.locationService.deleteEntity(id);
  }

  @Delete('eliminate/:id')
  eliminateEntity(@Param('id') id: string) {
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
    const newUpload: CreateLocationDTO[] =
      await this.csvProcessorService.processCsvBuffer(file.buffer, 'location');
    return await this.locationService.massiveUpload(newUpload);
  }
}
