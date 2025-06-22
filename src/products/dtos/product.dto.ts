import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateProductVariantDTO } from './product-variant.dto';

export class CreateProductDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly brand: string;

  @IsOptional()
  @IsArray()
  @ApiProperty({ type: [String], required: false })
  readonly features?: string[];

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
  readonly cautions?: string[];

  @IsNotEmpty()
  @IsArray()
  @ApiProperty({ type: [String] })
  readonly labelIds: string[];

  @IsNotEmpty()
  @IsArray()
  @ApiProperty({ type: [CreateProductVariantDTO] })
  readonly productVariants: CreateProductVariantDTO[];
}

export class UpdateProductDTO extends PartialType(CreateProductDTO) {}
