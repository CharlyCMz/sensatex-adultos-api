import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePostDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly description: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly url: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly redirectionUrl: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty()
  readonly isBanner: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty()
  readonly isMobile: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty()
  readonly isPost: boolean;
}

export class UpdatePostDTO extends PartialType(CreatePostDTO) {}
