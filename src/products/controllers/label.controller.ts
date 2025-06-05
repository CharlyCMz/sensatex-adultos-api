import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { LabelService } from '../services/label.service';
import { CreateLabelDTO, UpdateLabelDTO } from '../dtos/label.dto';

@Controller('labels')
export class LabelController {
  constructor(private labelService: LabelService) {}

  @Post()
  createEntity(@Body() payload: CreateLabelDTO) {
    return this.labelService.createEntity(payload);
  }

  @Get()
  findAll() {
    return this.labelService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.labelService.findOne(id);
  }

  @Put(':id')
  updateEntity(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateLabelDTO,
  ) {
    return this.labelService.updateEntity(id, payload);
  }

  @Delete(':id')
  deleteEntity(@Param('id', ParseIntPipe) id: number) {
    return this.labelService.deleteEntity(id);
  }

  @Delete('eliminate/:id')
  eliminateEntity(@Param('id', ParseIntPipe) id: number) {
    return this.labelService.eliminateEntity(id);
  }
}
