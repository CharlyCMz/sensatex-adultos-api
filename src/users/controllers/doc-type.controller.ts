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
import { DocTypeService } from '../services/doc-type.service';
import { CreateDocTypeDTO, UpdateDocTypeDTO } from '../dtos/doc-type.dto';

@Controller('doc-types')
export class DocTypeController {
  constructor(private docTypeService: DocTypeService) {}

  @Post()
  createEntity(@Body() payload: CreateDocTypeDTO) {
    return this.docTypeService.createEntity(payload);
  }

  @Get()
  findAll() {
    return this.docTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.docTypeService.findOne(id);
  }

  @Put(':id')
  updateEntity(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateDocTypeDTO,
  ) {
    return this.docTypeService.updateEntity(id, payload);
  }

  @Delete(':id')
  deleteEntity(@Param('id', ParseIntPipe) id: number) {
    return this.docTypeService.deleteEntity(id);
  }

  @Delete('eliminate/:id')
  eliminateEntity(@Param('id', ParseIntPipe) id: number) {
    return this.docTypeService.eliminateEntity(id);
  }
}
