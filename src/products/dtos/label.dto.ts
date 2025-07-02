import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateLabelDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly title: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly subCategoryId?: string;
}

export class UpdateLabelDTO extends PartialType(CreateLabelDTO) {}
