import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateVariantAttributeDTO } from './variant-attribute.dto';

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
  @ApiProperty({ type: [CreateVariantAttributeDTO], required: false })
  variantAttributes: CreateVariantAttributeDTO[];
}

export class UpdateProductVariantDTO extends PartialType(
  CreateProductVariantDTO,
) {}
