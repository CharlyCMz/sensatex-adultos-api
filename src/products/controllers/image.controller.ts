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
import { ImageService } from '../services/image.service';
import { CreateImageDTO, UpdateImageDTO } from '../dtos/image.dto';
import { CustomAuthGuard } from 'src/auth/guards/custom-auth.guard';

@UseGuards(CustomAuthGuard)
@Controller('images')
export class ImageController {
  constructor(private imageService: ImageService) {}

  @Post()
  createEntity(@Body() payload: CreateImageDTO) {
    return this.imageService.createEntity(payload);
  }

  @Get()
  findAll() {
    return this.imageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.imageService.findOne(id);
  }

  @Put(':id')
  updateEntity(@Param('id') id: string, @Body() payload: UpdateImageDTO) {
    return this.imageService.updateEntity(id, payload);
  }

  @Delete(':id')
  deleteEntity(@Param('id') id: string) {
    return this.imageService.deleteEntity(id);
  }

  @Delete('eliminate/:id')
  eliminateEntity(@Param('id') id: string) {
    return this.imageService.eliminateEntity(id);
  }
}
