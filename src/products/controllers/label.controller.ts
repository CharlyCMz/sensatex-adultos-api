import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
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
  findOne(@Param('id') id: string) {
    return this.labelService.findOne(id);
  }

  @Put(':id')
  updateEntity(@Param('id') id: string, @Body() payload: UpdateLabelDTO) {
    return this.labelService.updateEntity(id, payload);
  }

  @Delete(':id')
  deleteEntity(@Param('id') id: string) {
    return this.labelService.deleteEntity(id);
  }

  @Delete('eliminate/:id')
  eliminateEntity(@Param('id') id: string) {
    return this.labelService.eliminateEntity(id);
  }
}
