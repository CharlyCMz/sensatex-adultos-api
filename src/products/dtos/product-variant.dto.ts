import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

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

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly productId: string;
}

export class UpdateProductVariantDTO extends PartialType(
  CreateProductVariantDTO,
) {}
