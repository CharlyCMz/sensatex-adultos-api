import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import { CustomAuthGuard } from 'src/auth/guards/custom-auth.guard';
import { PostService } from '../services/post.service';
import { CreatePostDTO, UpdatePostDTO } from '../dtos/post.dto';

@UseGuards(CustomAuthGuard)
@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @Post()
  createEntity(@Body() payload: CreatePostDTO) {
    return this.postService.createEntity(payload);
  }

  @Get()
  @Public()
  findAll(
    @Query('isBanner') isBanner?: boolean,
    @Query('isPost') isPost?: boolean,
  ) {
    return this.postService.findAll(isBanner, isPost);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @Put(':id')
  updateEntity(@Param('id') id: string, @Body() payload: UpdatePostDTO) {
    return this.postService.updateEntity(id, payload);
  }

  @Delete(':id')
  deleteEntity(@Param('id') id: string) {
    return this.postService.deleteEntity(id);
  }

  @Delete('eliminate/:id')
  eliminateEntity(@Param('id') id: string) {
    return this.postService.eliminateEntity(id);
  }
}
