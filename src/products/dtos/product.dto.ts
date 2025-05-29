import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProductDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly brand: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly features: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly description: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly status: string;

  @IsOptional()
  @IsArray()
  @ApiProperty({ type: [String], required: false })
  cautions?: string[];
}

export class UpdateProductDTO extends PartialType(CreateProductDTO) {}
