import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { LocationService } from '../services/location.service';
import { CreateLocationDTO, UpdateLocationDTO } from '../dtos/location.dto';

@Controller('locations')
export class LocationController {
  constructor(private locationService: LocationService) {}

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
    return this.locationService.updateEndity(id, payload);
  }

  @Delete(':id')
  deleteEntity(@Param('id', ParseIntPipe) id: number) {
    return this.locationService.deleteEntity(id);
  }

  @Delete('eliminate/:id')
  eliminateEntity(@Param('id', ParseIntPipe) id: number) {
    return this.locationService.eliminateEntity(id);
  }
}
