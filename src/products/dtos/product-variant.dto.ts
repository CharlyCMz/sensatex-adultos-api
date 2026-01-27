import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { CreateImageDTO } from './image.dto';
import { Image } from '../entities/image.entity';

export class CreateProductVariantDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly sku: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly price: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly discountPrice?: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty()
  readonly isAvailable: boolean;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly productId?: string;

  @IsNotEmpty()
  @IsArray()
  @ApiProperty({ type: [String] })
  readonly variantAttributeIds: string[];

  @IsOptional()
  @IsArray()
  @ApiProperty({ type: [CreateImageDTO] })
  readonly images?: CreateImageDTO[];
}

export class UpdateProductVariantDTO {
  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly sku?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly price?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly discountPrice?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  readonly isAvailable?: boolean;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly productId?: string;

  @IsOptional()
  @IsArray()
  @ApiProperty({ type: [String] })
  readonly variantAttributeIds?: string[];

  @IsOptional()
  @IsArray()
  @ApiProperty({ type: [Image] })
  imagesToCreate?: Image[];

  @IsOptional()
  @IsArray()
  @ApiProperty({ type: [String] })
  imagesToDelete?: string[];
}
