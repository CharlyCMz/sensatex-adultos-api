import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateLabelDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly description: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  readonly categoryId?: number;
}

export class UpdateLabelDTO extends PartialType(CreateLabelDTO) {}
