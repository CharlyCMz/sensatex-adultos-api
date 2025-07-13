import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { DocTypeService } from '../services/doc-type.service';
import { CreateDocTypeDTO, UpdateDocTypeDTO } from '../dtos/doc-type.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { CustomAuthGuard } from 'src/auth/guards/custom-auth.guard';

@UseGuards(CustomAuthGuard)
@Controller('doc-types')
export class DocTypeController {
  constructor(private docTypeService: DocTypeService) {}

  @Post()
  createEntity(@Body() payload: CreateDocTypeDTO) {
    return this.docTypeService.createEntity(payload);
  }

  @Get()
  @Public()
  findAll() {
    return this.docTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.docTypeService.findOne(id);
  }

  @Put(':id')
  updateEntity(@Param('id') id: string, @Body() payload: UpdateDocTypeDTO) {
    return this.docTypeService.updateEntity(id, payload);
  }

  @Delete(':id')
  deleteEntity(@Param('id') id: string) {
    return this.docTypeService.deleteEntity(id);
  }

  @Delete('eliminate/:id')
  eliminateEntity(@Param('id') id: string) {
    return this.docTypeService.eliminateEntity(id);
  }
}
