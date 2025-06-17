import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProductVariantDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly sku: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly price: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly discountPrice: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty()
  readonly isAvailable: boolean;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  readonly productId?: string;

  @IsNotEmpty()
  @IsArray()
  @ApiProperty({ type: [Number] })
  readonly variantAttributeIds: number[];
}

export class UpdateProductVariantDTO extends PartialType(
  CreateProductVariantDTO,
) {}
